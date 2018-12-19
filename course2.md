# Using Angular with Django

<img src="https://raw.githubusercontent.com/wgoode3/djangular-example/master/New%20Mockup%201.png" alt="diagram.png" width="800px">

This course will assume you are already familiar with both Django and Angular. Django is a great web framework, and can be a capable REST server with a little configuration. Angular is a good choice for a front end framework and we will be able to take full advantage of its component based architecture. Moreover, both Django and Angular are "opinionated" about how they want us to code our projects. They provide us nicely bundled set of tools they prefer we use and there is generally one "right way" to go about solving our problems. In that sense combining Django and Angular can give us a very consistent and well-thought-out approach to our website.

<hr>

# Taking Django to the SPA

By default, Django wants us to create multiple templates (html files with embedded python) for the server to render to our users. If instead we would like to create a **S**ingle **P**age **A**pplication we will have to play around with the settings somewhat. Enter [django-spa](https://github.com/metakermit/django-spa).
Django SPA is a middleware that will make it easy for us to make Django serve up our ```index.html``` for us.

### Before we get started, make sure you have all of the following installed:
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

### Let's start out by creating a new virtual environment and installing Django along with Django SPA.

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

# Connecting Angular + Middleware Settings

<a href="https://youtu.be/8KoyisKqLlc" target="_blank">
	<img src="https://i.ytimg.com/vi/8KoyisKqLlc/hqdefault.jpg" alt="thumbnail">
</a>

### Start by editting our settings.py

```python
# make your list of installed apps look like this

INSTALLED_APPS = [
	'papaya_app',
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

Note that we have elected to skip the ```apps``` folder so we can simply add ```'papaya_app'``` to our list of installed apps. Also we removed a few unused apps, namely ```'django.contrib.admin'``` and ```'django.contrib.auth'```. Next be sure to add ```'whitenoise.middleware.WhiteNoiseMiddleware'``` and ```'spa.middleware.SPAMiddleware'``` to our list of middleware. Also we decided to remove a few unused middleware as we did above with the apps, namely ```'django.middleware.csrf.CsrfViewMiddleware'```, ```'django.contrib.auth.middleware.AuthenticationMiddleware'```, and ```'django.contrib.messages.middleware.MessageMiddleware'```.

Lastly be sure to add in ```STATIC_ROOT``` and point it to the ```dist``` folder in our angular app and also add the ```STATICFILES_STORAGE``` line.

After this we should be able to view our angular app's ```index.html``` when we run ```ng build --watch``` and ```python manage.py runserver```.

<hr>

# Getting and Posting data to our Django server

<a href="https://youtu.be/OHww_idvEss" target="_blank">
	<img src="https://i.ytimg.com/vi/OHww_idvEss/hqdefault.jpg" alt="thumbnail">
</a>

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

# Assignment 1 - Django Angular Tasks

### Objectives:
* Practice using Django with Angular
* Make a backend to use with existing code

<img src="https://raw.githubusercontent.com/wgoode3/djangular-example/master/tasks.png" alt="wireframe">

Let's start with an existing Angular frontend [click to download](https://github.com/wgoode3/djangular-example/raw/master/client.zip) and let us replace our existing client folder with this. Build out the backend with restful routes to create, read, update, and delete tasks. 

<strong>Bonus Challenge:</strong> Alter the client code to display validation errors.

<strong>Hacker Challenge:</strong> Alter the client code to also use [front end validations](https://angular.io/guide/form-validation).

<hr>

# Optional - Using a database other than SQLite

While SQLite is a very convenient database when developing, your project might benefit from a different database. In Django changing the database can be very easy to do, and we'll include examples for how you might do that.

### Mongo

If you want to connect to a Mongo database using Django, the easiest way might be [Djongo](https://nesdis.github.io/djongo/).

First we need to install the ```djongo``` package using pip. Make sure your virtualenvironment is active.

```shell
pip install djongo
```

Then we will modify the ```DATABASE``` setting in the ```settings.py``` accordingly.

```python
# Replace the DATABASE setting with this...
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'amazing_tasks'
    }
}
```

That's it. Assuming mongodb is running, it will create a ```db``` called 'amazing_tasks' and connect to it. You can continue to use the Django ORM as you have previously.

### MySQL

Connecting to a MySQL database will be a little bit more involved. These instructions will assume you are using it during deployment to an Ubuntu server.

Make sure your virtualenvironment is active

```shell
sudo apt-get install python3-dev
sudo apt-get install python3-dev libmysqlclient-dev
sudo apt-get install mysql-server
pip install mysqlclient
mysql -u root -p
# enter your password (root) when prompted
create schema amazing_tasks;
exit
```

Then we will modify the ```DATABASE``` setting in the ```settings.py``` accordingly.

```python
# Replace the DATABASE setting with this...
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'amazing_tasks',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': 'localhost',
        'PORT': '3306',
    }
} 
```

You may need to adjust the values of ```USER``` and ```PASSWORD``` accordingly. Make sure the ```NAME``` is the same as the name of the schema you created in MySQL above.

<hr>

# Assignment 2 - Django Angular Login and Registration

### Objectives:
* Gain more practice using Django with Angular
* Practice keeping track of the user's state

<img src="https://raw.githubusercontent.com/wgoode3/djangular-example/master/logandregupdated.png" alt="wireframe image">

Build a login and registration form using Django and Angular. 

<strong>Bonus Challenge:</strong> Prevent the user from accessing the success page if they are not logged in.

<hr>

# Assignment 3 - Django Angular E-Commerce (OPTIONAL)

### Objectives:
* Build a complex project using many relationships

<img src="https://raw.githubusercontent.com/wgoode3/djangular-example/master/ecommerceupdated.png" alt="ecommerce wireframe">

Try to build this e commerce website using Django and Angular.
