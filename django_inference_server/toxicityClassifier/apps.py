from django.apps import AppConfig
from django.http import HttpResponse
import fastai.text as text
import fastai
import json


class ToxicityclassifierConfig(AppConfig):
    name = 'toxicityClassifier'
    model_folder = './toxicityClassifier/models'


class ToxicityCheck:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        path = text.Path(
            ToxicityclassifierConfig.model_folder)
        text.defaults.device = text.torch.device('cpu')
        fastai.torch_core.defaults.device = text.torch.device('cpu')
        self.learner = text.load_learner(path, 'text_toxicity.pkl').to_fp32()

    def isToxic(self, comment):
        result = self.learner.predict(comment)
        return result[2][1].data.numpy() > result[2][0].data.numpy()

def checkIsTocic(request):
    comment = request.body.comment
    if request.method == 'POST':
        response_data = {}
        check = ToxicityCheck()
        response['isToxic'] = check.isToxic(comment)
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    return