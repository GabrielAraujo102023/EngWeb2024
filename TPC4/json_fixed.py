import json

with open('compositores.json', 'r') as f:
    data = json.load(f)

periodos = []
ind = {}
id_cont = 0
for compositor in data['compositores']:
    if compositor['periodo'] in ind.keys():
        periodos[ind[compositor['periodo']]]['compositores'].append(compositor['id'])
    else:
        ind[compositor['periodo']] = id_cont
        periodos.append({'id':id_cont, 'nome':compositor['periodo'], 'compositores':[compositor['id']]})
        id_cont += 1
        
data['periodos'] = periodos

with open('compositores_fixed.json', 'w') as f:
    json.dump(data, f)