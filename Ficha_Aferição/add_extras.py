import requests
import json

dataset = 1

while dataset < 4:
    with open(f'./datasets/dataset-extra{dataset}.json', 'r') as extra:
        data = json.load(extra)
        for pessoa in data:
            response = requests.post('localhost:7777', data=data)
            if response.status_code != 200:
                print('POST request failed:', response.status_code)
                print(data)
    dataset += 1