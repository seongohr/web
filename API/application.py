from flask import Flask, request, jsonify, render_template, current_app
import csv

import json

app = Flask(__name__, static_folder='./static')

app.config['JSON_SORT_KEYS'] = False
app.config['DEBUG'] = True

FILENAME = "./static/ra_data_classifier.csv"

def read_datas():
    datas = {}
    with current_app.open_resource(FILENAME) as csvfile:
        lines =  csvfile.readlines()
        for i in range(len(lines)):
            lines[i] = lines[i].decode("ISO-8859-1")
        fields = lines[0][:-2].split(',')
        reader = csv.reader(lines[1:], delimiter=',')
        for row in reader:
            datas[row[0]] = {
                fields[1]: row[1],
                fields[2]: row[2]
            }
    return fields, datas

def get_json_data(hid, datas):
    json_data = {}
    if hid in datas.keys():
        targetValue = datas[hid]
        json_data["hid"] = hid
        json_data["contents"] = targetValue
    else:
        json_data["hid"] = hid
        json_data["contents"] = "No data with that hid, check your hid."
    json_data = jsonify(json_data)
    return json_data

@app.route('/')
def index():
    return render_template('test.html')

@app.route('/get_data', methods=['GET', 'POST'])
def get_data():
    fields, datas = read_datas()
    if request.method == 'POST':
        hid = request.form['hid']
        d = get_json_data(hid, datas)
        return d
    
    if request.method == 'GET':
        hid = request.args['hid']
        d = get_json_data(hid, datas)
        return d


if __name__ == "__main__":
    app.run()