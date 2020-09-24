from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient

from datetime import datetime, timedelta, timezone
import jpholiday

app = Flask(__name__)
client = MongoClient("localhost:27017")
db = client.IS_B
CORS(app)

holiday_port = 5003

vold_check_list = []
def check_void_contents(list_data):

    return_dir = {'_id': str(list_data["_id"]), 'name': list_data['date']}

    for query in vold_check_list:
        if (query in list_data):
            return_dir[query] =  list_data[query]
        else:
            return_dir[query] = ""

    return return_dir

def get_output_json(Data = []):

    if Data == []:
        Data = db.SpecificHoliday.find()
    output = []

    for s in Data:
        output.append(check_void_contents(s))

    return jsonify({'result': output})

# 今日の情報を管理. 管理する情報
# 1.今日の日付(曜日), 2.今日が土日祝かどうか, 3.今日が特定の休日(求:引数)かどうか
class today_info:

    def __init__(self):
        self.now = datetime.now(timezone(timedelta(hours = +9))).date()
        print(self.now)
    
    def is_holiday(self):
        is_weekday = self.now.weekday() < 5
        is_public_holiday = jpholiday.is_holiday(self.now)

        if not(is_weekday) or is_public_holiday:
            return True

        return False

    def is_specific_holiday(self, holiday_list):
        if str(self.now) in holiday_list:
            return True
        
        return False

@app.route("/", methods = ["GET"])
def get_all_holiday():

    return get_output_json()

@app.route("/get_is_bisiness_day", methods = ["GET"])
def is_bisiness_day():

    date_info = today_info()

    if not(date_info.is_holiday()):

        Data = db.SpecificHoliday
        holiday_info = Data.find()
        holiday_list = list(map(lambda h: h["date"], holiday_info))

        if not(date_info.is_specific_holiday(holiday_list)):

            return jsonify({"result": True})

    return jsonify({"result": False})

@app.route("/", methods = ["POST"])
def set_specific_holiday():

    Data = db.SpecificHoliday

    data = request.get_json(force = True)
    holiday_date = data.get("date", None)

    Data.insert_one({"date": holiday_date})

    return get_output_json()

if __name__ == "__main__":

    app.debug = True
    app.run(host = '0.0.0.0', port = holiday_port)

