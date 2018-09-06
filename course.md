# Using Angular with Django

<img src="https://cdn-images-1.medium.com/max/1600/1*1OBwwxzJksMv0YDD-XmyBw.png" height="200px" alt="django"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/240px-Angular_full_color_logo.svg.png" height="200px" alt="angular">

This course will assume you are already familiar with both Django and Angular. Django is a great web framework, and can be a capable REST server with little configuration. Angular is a good choice for a front end framework and we will be able to take full advantage of its component based architecture.

### Taking Django to the SPA

By default, Django wants us to create multiple templates (html files with embedded python) for the server to render to our users. If instead we would like to create a **S**ingle **P**age **A**pplication we will have to play around with the settings somewhat. Enter [django-spa](https://github.com/metakermit/django-spa).
Django SPA is a middleware that will make it easy for us to make Django serve up our ```index.html``` and not try to render it for us.

Let's start out by creating a new virtual environment and installing Django along with Django SPA

```shell
virtualenv venv -p python3
source venv/bin/activate
pip install django django-spa
```

Then we can make our project and start an app (we will be skipping the creation of an apps folder as it's unnecessary)

```shell
django-admin startproject tasks
cd tasks
python manage.py startapp task_app
```

Next we'll do something a little bit different. It's time to also create our Angular front end.
Open a second tab or terminal window and navigate into the tasks project.

```shell
ng new client --routing
cd client/src/app
ng g s task
ng g c task-list
ng g c task-new
ng g c task-edit
cd ../..
ng build --watch
```

### Now we can start editting our files

Starting with: ```settings.py```

```python
# make your list of installed apps look like this

INSTALLED_APPS = [
	'task_app',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
]

# and make your list of middleware look like this

MIDDLEWARE = [
	'django.middleware.security.SecurityMiddleware',
	'whitenoise.middleware.WhiteNoiseMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'spa.middleware.SPAMiddleware'
]

# add these lines at the bottom of the file

STATIC_ROOT = os.path.join(BASE_DIR, "client/dist/client/")
STATICFILES_STORAGE = 'spa.storage.SPAStaticFilesStorage'
```

Note we are electing not to use ```Auth``` and ```Admin``` so we have removed them from ```INSTALLED_APPS```.
Also note that ```STATIC_ROOT``` now points to the folder containing the ```index.html``` for our angular project.

Next up: ```urls.py```

We will keep everything inside of one ```urls.py``` file to make our REST server that much easier to set up.

```python
from django.urls import path
from task_app import views as tasks

urlpatterns = [
	path('task', tasks.Tasks.as_view()),
	path('task/<int:task_id>', tasks.TasksDetails.as_view())
]
```

Note we are using Django 2+ for this, for older versions of Django use the ```url``` function instead of ```path```. Also we have decided to "alias" the ```views``` we're importing using the keyword ```as```. By aliasing we can avoid having to create an ```apps``` folder even if we decide to use multiple apps.

Now to turn our attention to our ```views.py```

```python
from django.http import JsonResponse
import json
from .models import Task
from django.views import View

class Tasks(View):

    def get(self, req):
        return JsonResponse({'status': 200, 'tasks': list(Task.objects.values().all())})

    def post(self, req):
        results = Task.objects.add_task(json.loads(req.body.decode()))
        if isinstance(results, Task):
            return JsonResponse({'status': 200, 'task_id': results.id})
        else:
            return JsonResponse({'status': 200, 'errors': results})

class TasksDetails(View):

    def get(self, req, task_id):
        return JsonResponse({'status': 200, 'task': Task.objects.values().get(id=task_id)})

    def put(self, req, task_id):
        results = Task.objects.update_task(json.loads(req.body.decode()), task_id)
        if isinstance(results, Task):
            return JsonResponse({'status': 200, 'task_id': results.id})
        else:
            return JsonResponse({'status': 200, 'errors': results})

    def delete(self, req, task_id):
        Task.objects.filter(id=task_id).delete()
        return JsonResponse({'status': 200})
```

There is a lot going on here, so I'll try to explain.

The thing that likely sticks out the most, is the conspicuous lack of view functions. We are electing to use class based views instead. Class based views allow us to map a route like ```/task/3``` to a class with methods that can handle what to do for each HTTP verb (GET, POST, PUT, and DELETE).

Using class based views we can handle all 5 routes we need with only two classes.

| Verb   | Route   | Description                       |
|--------|---------|-----------------------------------|
| GET    | /task   | Return a list of all of our tasks |
| POST   | /task   | Create a new task                 |
| GET    | /task/3 | Return the task with id = 3       |
| PUT    | /task/3 | Update the task with id = 3       |
| DELETE | /task/3 | Delete the task with id = 3       |

The next thing to notice is that we aren't using ```render``` or ```redirect```. Aside from serving the one static ```index.html``` page, we want this server to only respond with JSON, so every route receives a JsonResponse.

One last thing to note. For our POST and PUT methods we will be receiving data from the front end inside of ```req.body```. This comes back to us as a unicode encoded string. To work with the data more conveniently we are decoding and converting to a dictionary with ```json.loads(req.body.decode())```.

Wrapping up our back end, we'll finish off ```models.py```

```python
from django.db import models

class TaskManager(models.Manager):

    def validate(self, data):
        errors = {}

        if 'title' not in data:
            errors['title'] = 'Title is required'
        elif len(data['title']) < 3:
            errors['title'] = 'Title must be 3 characters or longer'
        
        if 'description' not in data:
            errors['description'] = 'Description is required'
        elif len(data['description']) < 5:
            errors['description'] = 'Description must be 5 characters or longer'

        return errors

    def add_task(self, data):
        errors = self.validate(data)
        
        if len(errors) > 0:
            return errors
        else:
            return Task.objects.create(
                title = data['title'], 
                description = data['description'], 
                status = 'pending'
            )

    def update_task(self, data, id):
        errors = self.validate(data)
        
        if len(errors) > 0:
            return errors
        else:
            task = Task.objects.get(id=id)
            task.title = data['title']
            task.description = data['description']
            task.status = data['status']
            task.save()
            return task

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = TaskManager()
```