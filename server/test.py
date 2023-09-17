from flask import Flask, jsonify, make_response, render_template
from flask_cors import CORS
import requests
from pyngrok import ngrok

port_no = 5000
app = Flask(__name__)
CORS(app)

# Set up ngrok
ngrok.set_auth_token("")
public_url =  ngrok.connect(port_no,headers={'ngrok-skip-browser-warning': 'true'}, bind_tls=True).public_url

@app.route('/getNotification', methods=['POST'])
def notificationData():
    payload = {
        "notifications":[{
	        "AssetType":"Name",
            "ServiceRequiredFrom": "MM/DD/YYYY",
            "ServiceBefore": "MM/DD/YYYY",
            "room":"000"}]
        }
   
    return jsonify(payload)

@app.route('/getFutureSeries', methods=['POST'])
def futureData():
    payload = {
        "futureServices":[{
	        "AssetType":"Name",
            "ServiceRequiredFrom": "MM/DD/YYYY",
            "ServiceBefore": "MM/DD/YYYY",
            "room":"000"
        }]
    }
    return jsonify(payload) 


print(f"To acces the Gloable link please click {public_url}")

@app.route('/')
def home():
    return render_template("../index.html")
app.run(port=port_no)