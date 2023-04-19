# -*- coding: utf-8 -*-
"""
Created on Wed Apr 19 19:48:19 2023

@author: sujit simon
"""
import asyncio
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print("I'm connected!")
    sio.emit('login', 'testing')

sio.connect('http://127.0.0.1:5000')
