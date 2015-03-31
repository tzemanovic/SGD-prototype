#pragma strict

var speed : float = 10.0f;
var direction : Direction = Direction.East;

private var rb: Rigidbody;

enum Direction{North, East, South, West}

function Start () {
	rb = GetComponent.<Rigidbody>();
}

function Update () {
	if (Input.GetKey (KeyCode.UpArrow) || Input.GetKey (KeyCode.W))
	{
		direction = Direction.North;
	}
	if (Input.GetKey (KeyCode.DownArrow) || Input.GetKey (KeyCode.S))
	{
		direction = Direction.South;
	}
	if (Input.GetKey (KeyCode.LeftArrow) || Input.GetKey (KeyCode.A))
	{
		direction = Direction.West;
	}
	if (Input.GetKey (KeyCode.RightArrow) || Input.GetKey (KeyCode.D))
	{
		direction = Direction.East;
	}
	switch(direction)
	{
		case Direction.North:
		rb.velocity = Vector3(0,0,speed);
		break;
		case Direction.South:
		rb.velocity = Vector3(0,0,-speed);
		break;
		case Direction.West:
		rb.velocity = Vector3(-speed,0,0);
		break;
		case Direction.East:
		rb.velocity = Vector3(speed,0,0);
		break;
	}
}