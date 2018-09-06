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