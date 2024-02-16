import xml.etree.ElementTree as ET
import os
import sys

def make_path(path):
    return '../MapaRuas-materialBase' + path[2:]

index_html = html="""
<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <title>TPC1 - A102023</title>
    <meta charset="utf-8">
</head>
<body>
<ul>
"""

html = ''
ruas = []

for root, dirs, files in os.walk('./MapaRuas-materialBase/texto'):
    for file in files:
        html = """
        <!DOCTYPE html>
        <html lang="pt-PT">
        <head>
            <title>TPC1 - A102023</title>
            <meta charset="utf-8">
        </head>
        <body>

        """
        xml_root = ET.parse(os.path.join(root, file)).getroot()
        rua = ''
        for root_child in xml_root:
            if root_child.tag == 'corpo':
                for child in root_child:
                    if child.tag == 'figura':
                        for figura_child in child:
                            if figura_child.tag == 'imagem':
                                html += f'<img src="{make_path(figura_child.attrib["path"])}">'
                            else:
                                html += f'<label>{figura_child.text}</label>'

                    elif child.tag == 'para':
                        html += f'<p>{"".join(child.itertext())}</p>'

                    elif child.tag == 'lista-casas':
                        html += '<ol>'
                        for casa in child:
                            html += '<li><dl>'
                            for casa_child in casa:
                                if casa_child.tag != 'número':
                                    html += f'<dt>{casa_child.tag.capitalize()}</dt>'
                                    if casa_child.tag == 'desc':
                                        for para in casa_child:
                                            html += f'<dd>{para.text}</dd>'
                                    else:
                                        html += f'<dd>{casa_child.text}</dd>'
                            html += '</dl></li>'
                        html += '</ol>'

            elif root_child.tag == 'meta':
                for meta_child in root_child:
                    if meta_child.tag == 'nome':
                        rua = meta_child.text
        html += '</body>'
        fhtml = open(f'./ruas/{rua}.html', 'w', encoding='utf-8')
        fhtml.write(html)
        fhtml.close()
        ruas.append(rua)

for r in sorted(ruas):
    index_html += f'<li><a href="./ruas/{r}.html">{r}</li>'

index_html += '</ul>'
index_html += '</body>'

ifhtml = open('index.html', 'w', encoding='utf-8')
ifhtml.write(index_html)
ifhtml.close()