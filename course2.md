# Using Angular with Django

<img src="https://cdn-images-1.medium.com/max/1600/1*1OBwwxzJksMv0YDD-XmyBw.png" height="200px" alt="django"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/240px-Angular_full_color_logo.svg.png" height="200px" alt="angular">

This course will assume you are already familiar with both Django and Angular. Django is a great web framework, and can be a capable REST server with a little configuration. Angular is a good choice for a front end framework and we will be able to take full advantage of its component based architecture. Moreover, both Django and Angular are "opinionated" about how they want us to code our projects. They provide us nicely bundled set of tools they prefer we use and their is generally one "right way" to go about solving our problems. In that sense combining Django and Angular can give us a very consistent and well-thought-out approach to our website.

<hr>

### Taking Django to the SPA

By default, Django wants us to create multiple templates (html files with embedded python) for the server to render to our users. If instead we would like to create a **S**ingle **P**age **A**pplication we will have to play around with the settings somewhat. Enter [django-spa](https://github.com/metakermit/django-spa).
Django SPA is a middleware that will make it easy for us to make Django serve up our ```index.html``` for us.

#### Before we get started, make sure you have all of the following installed:
* [Python 3.5 or newer](https://www.python.org/downloads/)
* [Virtualenv](https://virtualenv.pypa.io/en/latest/installation/)
* [Node.js](https://nodejs.org/en/download/)
* [Angular CLI](https://cli.angular.io/)
  ```shell
  # you should be able to run the following
  $ npm i -g @angular/cli
  # if you receive errors relating to permissions try sudo
  $ sudo npm i -g @angular/cli
  ```

#### Let's start out by creating a new virtual environment and installing Django along with Django SPA.

```shell
virtualenv venv -p python3
source venv/bin/activate
pip install django django-spa
```

Then proceed to make a new project as normal, I would suggest this folder structure for now. If for instance we are making a project called ```papaya``` we would run ```django-admin startproject papaya```. Then inside of the first ```/papaya``` folder we could run ```python manage.py startapp papaya_app```. We will also want to create our angular app here as well with ```ng new client --routing```.

```
├─ papaya
┊ ├─ client
┊ ┊ ├─ e2e
┊ ┊ ├─ node_modules
┊ ┊ ├─ src
┊ ┊ ├─ angular.json
┊ ├─ papaya
┊ ┊ ├─ settings.py
┊ ┊ ├─ urls.py
┊ ├─ papaya_app
┊ ┊ ├─ models.py
┊ ┊ ├─ views.py
├─ venv
        
# some files and folders removed for brevity
```

<hr>

### Now to start editting our files

#### Starting with: ```settings.py```

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

At this we should be able to view our angular app's ```index.html``` when we run ```ng build --watch```.

# TODO: INSERT VIDEO HERE

<hr>

### How do we get and receive data from our Django Backend?

Let's start with an existing Angular frontend...

# TODO: INSERT DOWNLOAD LINK HERE
# TODO: INSERT WIREFRAME IMAGE HERE

and let us replace our existing client folder with this.

In order to get and receive requests, we need to first configure our ```urls.py```.

```python
from django.urls import path
from papaya_app.views import Papayas, PapayaDetails

urlpatterns = [
    path('papaya', Papayas.as_view()),
    path('papaya/<int:papaya_id>', PapayaDetails.as_view())
]
```

#### Note: we have elected to use version 2+ for Django, for older versions you will need to use the url function instead of path

Next we will need to create the ```Papayas``` and ```PapayaDetails``` classes in our ```views.py```. To make setting up our Django server with RESTful routes easier we will be making use of Django's [class based views](https://docs.djangoproject.com/en/2.1/topics/class-based-views/). 

Inside of ```papaya_app/views.py``` we will need to add the following code.

```python
from django.http import JsonResponse
from django.views import View

class Papayas(View):

    def get(self, request):
        return JsonResponse({'status': 'ok'})

    def post(self, request):
        return JsonResponse({'status': 'ok'})

class PapayaDetails(View):

    def get(self, request, papaya_id):
        return JsonResponse({'status': 'ok'})

    def put(self, request, papaya_id):
        return JsonResponse({'status': 'ok'})

    def delete(self, request, papaya_id):
        return JsonResponse({'status': 'ok'})
```

Using class based views we can handle all 5 routes we need with only two classes.

| Verb   | Route     | Description                         |
|--------|-----------|-------------------------------------|
| GET    | /papaya   | Return a list of all of our papayas |
| POST   | /papaya   | Create a new papaya                 |
| GET    | /papaya/3 | Return the papaya with id = 3       |
| PUT    | /papaya/3 | Update the papaya with id = 3       |
| DELETE | /papaya/3 | Delete the papaya with id = 3       |

The next thing to notice is that we aren't using ```render``` or ```redirect```. Aside from serving the one static ```index.html``` page, we want this server to only respond with JSON, so every route receives a JsonResponse.

<hr>
