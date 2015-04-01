#pragma strict

var x: float;
var y: float;
var width: float;
var height: float;

function Start () {
	this.camera.rect.x = x / Screen.width;
	this.camera.rect.y = 1.0f - (y / Screen.height) - (height / Screen.height);	
	this.camera.rect.width = width / Screen.width;
	this.camera.rect.height = height / Screen.height;
}

function Update () {
	
}