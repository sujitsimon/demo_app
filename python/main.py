# -*- coding: utf-8 -*-
"""
Created on Wed Apr 19 19:09:41 2023

@author: sujit simon
"""

import os
import pandas as pd
import numpy as np
from sklearn import linear_model
from aiohttp import web
import socketio
from enum import Enum


sio = socketio.AsyncServer()
app = web.Application()
sio.attach(app)

DEFAULT_FILE_PATH = os.path.join('..', 'server', 'upload_path')

class Regression:
    def __init__(self, file_name: str):
        self.file_name = file_name
        self.data_frame = pd.read_csv(file_name)
    
    
    def __call__(self, model : linear_model) -> linear_model:
        x = self.data_frame['x'].to_numpy().reshape(-1, 1)
        y = self.data_frame['y'].to_numpy().reshape(-1, 1)
        fit = model.fit(x, y)
        return fit
        
@sio.event
def connect(sid, environ):
    print('connect ', sid)
    
@sio.on('handle_upload')
async def handle_upload(sid, data):
    print('handle_upload', data)
    regression = Regression(os.path.join(DEFAULT_FILE_PATH, data))
    result = regression(linear_model.LinearRegression())
    print(result, {'coef': result.coef_, 'intercept': result.intercept_})
    x = regression.data_frame['x'].to_list()
    y = regression.data_frame['y'].to_list()
    xmin, xmax = min(x), max(x)
    coef = result.coef_.tolist()[0][0]
    intercept = result.intercept_.tolist()[0]
    ymin, ymax = coef * xmin + intercept, coef * xmax + intercept
    await sio.emit('fit_data', {'coef': coef,
                                'intercept': intercept,
                                'x': x,
                                'y': y,
                                'line': {'x': [xmin, xmax], 'y': [ymin, ymax]}
                                })
    
if __name__ == '__main__':
    web.run_app(app, host='127.0.0.1', port=5000)  

