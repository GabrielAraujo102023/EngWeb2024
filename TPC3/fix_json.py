import re
actors = set()
genres = set()
with open('./filmes.json', 'r') as old, open('./filmes_fixed.json', 'w') as new:
    new.write('{"movies": [')
    n_lines = 1
    for line in old:
        c = re.search(r'"cast":\[(.*)\]*?', line)
        g = re.search(r'"genres":\[(.*)\]*?', line)

        if c and c.group(0):
            for actor in c.group(0)[8:].split(','):
                if actor[-1] == ']':
                    actors.add(actor[:-1])
                    continue
                actors.add(actor)

        if g and g.group(0):
            for genre in g.group(0)[10:].split(','):
                if genre[-1] == '}' and genre[-2] == ']':
                    genres.add(genre[:-2])
                    continue
                genres.add(genre)

        new.write(line)
        if n_lines != 28796:
            new.write(',')
        n_lines += 1

    new.write('],\n"actors": [')
    n_actors = 1
    for actor in actors:
        
        if actor != '' and actor != ' ' and not re.search(r'\d+', actor) and not re.search(r'[._?\(\)\'=:{}\\\[\]]', actor):
            if actor[0] != '"':
                actor = '"' + actor
            if actor[-1] != '"':
                actor = actor + '"'
            new.write('{"id":"' + str(n_actors) + '","name":' + actor + '}\n')
            if n_actors != len(actors):
                new.write(',')
        n_actors += 1
    new.write('],\n"genres": [')
    
    n_genres = 1
    for genre in genres:
        if genre != '':
            new.write('{"id":"' + str(n_genres) + '","name":' + genre + '}\n')
            if n_genres != len(genres):
                new.write(',')
        n_genres += 1
    new.write(']}')