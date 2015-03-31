#pragma strict

var speed: float = 10.0f;
var direction: Direction = Direction.East;
var maxCrossRoadDistanceToTurn = 5.0f;

private var rb: Rigidbody;
private var north: boolean = false;
private var east: boolean = false;
private var south: boolean = false;
private var west: boolean = false;
private var isOnCrossRoad: boolean = false;
private var crossRoadPos: Vector3;

enum Direction{North, East, South, West}

function Start () {
	rb = GetComponent.<Rigidbody>();
}

function ChangeDirection (newDirection: Direction)
{
	if (isOnCrossRoad)
	{
		//Debug.Log(Vector3.Distance(this.transform.position, crossRoadPos));
		if (Vector3.Distance(this.transform.position, crossRoadPos) <= maxCrossRoadDistanceToTurn)
		{
			direction = newDirection;
		}
	}
	else
	{
		direction = newDirection;
	}
}

function Move (allowed: boolean, vel: Vector3)
{
	if (allowed)
	{
		Debug.Log("east");
		rb.velocity = vel;		
	}
	else
	{
		Debug.Log("no east");
		if (isOnCrossRoad && Vector3.Distance(this.transform.position, crossRoadPos) <= maxCrossRoadDistanceToTurn)
		{
			rb.velocity = Vector3(0,0,0);
		}
	}
}

function Update () {
	Debug.Log("Dir " + direction + ", N " + north + ", E " + east + ", S " + south + ", W " + west);
		Debug.Log(rb.velocity);
	// crowd controls
	if (north && (Input.GetKey (KeyCode.UpArrow) || Input.GetKey (KeyCode.W)))
	{
		ChangeDirection (Direction.North);
	}
	if (south && (Input.GetKey (KeyCode.DownArrow) || Input.GetKey (KeyCode.S)))
	{
		ChangeDirection (Direction.South);
	}
	if (west && (Input.GetKey (KeyCode.LeftArrow) || Input.GetKey (KeyCode.A)))
	{
		ChangeDirection (Direction.West);
	}
	if (east && (Input.GetKey (KeyCode.RightArrow) || Input.GetKey (KeyCode.D)))
	{
		ChangeDirection (Direction.East);
	}
	// change rigidBody's velocity depending on the direction
	switch(direction)
	{
		case Direction.North:
		Move (north, Vector3(0,0,speed));
		break;
		case Direction.South:
		Move (south, Vector3(0,0,-speed));
		break;
		case Direction.West:
		Move (west, Vector3(-speed,0,0));
		break;
		case Direction.East:
		Move (east, Vector3(speed,0,0));
		break;
	}
}

function OnTriggerEnter(other: Collider) {
	// get the road the crowd is standing on
	var road: Road = other.gameObject.GetComponent.<Road>();
	// get the allowed directions on the road
	north = road.north;
	south = road.south;
	west = road.west;
	east = road.east;
	var roadScale = other.transform.localScale;
	if (roadScale.x == roadScale.z)
	{
		isOnCrossRoad = true;
		crossRoadPos = other.transform.position;
	}
	else
	{
		isOnCrossRoad = false;
	}
//	if (roadScale.x > roadScale.z)
//	{
//		transform.position.z = other.transform.position.z;
//	}
//	else if (roadScale.x < roadScale.z)
//	{
//		transform.position.x = other.transform.position.x;
//	}
}