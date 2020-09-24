from flask import jsonify
 
from pykakasi import kakasi

# ※注意
# このpythonファイルはほかのファイル(appointment, employee等)と同じディレクトリに入れて下さい
# 異なるディレクトリに入っていると動作しない可能性があります

# 出力用のjson作成用
# 引数はCursor(Data.find()で作る)
def get_output_json(Data, check_list):

    output = list(map(check_void_contents, Data, [check_list] * Data.count()))

    return jsonify({"result": output})

# レコード内に要素がセットされていない要素への対応
# ex) slack_email
def check_void_contents(dict_output_data, void_check_list):

    keys = set(dict_output_data.keys()) - set(void_check_list)

    return_dict = {}
    
    for k in keys:
        if k == "_id":
            return_dict[k] = str(dict_output_data[k])
        else:
            return_dict[k] = dict_output_data[k]

    for query in void_check_list:
        if (query in dict_output_data):
            return_dict[query] =  dict_output_data[query]
        else:
            return_dict[query] = ""

    return return_dict


# 変換したい文字列をリストで与える
def to_roman(namelist):

    # kakasi(converter)の設定
    kakasi_ = kakasi()
    kakasi_.setMode('J', 'a')
    kakasi_.setMode('H', 'a')
    kakasi_.setMode('K', 'a')

    cnv = kakasi_.getConverter()

    return list(map(cnv.do, namelist))

# 受付番号の発行
# 受付番号の桁数はdigitsで指定(default: 6)
def get_registration_id(all_data, digits = 6):
        
    reg_id = 1

    id_list = list(map(lambda x: x["appointment_id"], all_data))

    if len(id_list) != 0:
        reg_id = max(map(lambda x: int(x), id_list)) + 1
    reg_id = str(reg_id).zfill(digits)

    return reg_id