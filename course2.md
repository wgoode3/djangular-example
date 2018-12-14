# Using Angular with Django

<img src="https://cdn-images-1.medium.com/max/1600/1*1OBwwxzJksMv0YDD-XmyBw.png" height="200px" alt="django"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/240px-Angular_full_color_logo.svg.png" height="200px" alt="angular">

This course will assume you are already familiar with both Django and Angular. Django is a great web framework, and can be a capable REST server with a little configuration. Angular is a good choice for a front end framework and we will be able to take full advantage of its component based architecture. Moreover, both Django and Angular are "opinionated" about how they want us to code our projects. They provide us nicely bundled set of tools they prefer we use and their is generally one "right way" to go about solving our problems. In that sense combining Django and Angular can give us a very consistent and well-thought-out approach to our website.

### Taking Django to the SPA

By default, Django wants us to create multiple templates (html files with embedded python) for the server to render to our users. If instead we would like to create a **S**ingle **P**age **A**pplication we will have to play around with the settings somewhat. Enter [django-spa](https://github.com/metakermit/django-spa).
Django SPA is a middleware that will make it easy for us to make Django serve up our ```index.html``` for us.

Before we get started, make sure you have all of the following installed:
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

Let's start out by creating a new virtual environment and installing Django along with Django SPA.

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
        
# some files and folders removed for brevity
```
