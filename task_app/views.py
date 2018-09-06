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