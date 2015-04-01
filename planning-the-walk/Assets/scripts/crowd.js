#pragma strict
import System.Collections.Generic;

var speed: float = 10.0f;
var direction: Direction = Direction.East;
var maxCrossRoadDistanceToTurn = 4.0f;
var maxCrossRoadDistanceToStop = 3.0f;
var turnDuration = 2.0f;
var finishDuration = 2.0f;
var game: Game;

private var rb: Rigidbody;
private var north: boolean = false;
private var east: boolean = false;
private var south: boolean = false;
private var west: boolean = false;
private var isOnCrossRoad: boolean = false;
private var turnEnd = 0.0f;
private var turnAngle: float;
private var finishEnd = 0.0f;
private var crossRoadPos: Vector3;
private var characters: List.<Transform> = new List.<Transform>();
private var charAnims: List.<Animator> = new List.<Animator>();

enum Direction{North, East, South, West}

function Start () {
	rb = GetComponent.<Rigidbody>();
	for (var child : Transform in transform) 
	{
	    if (child.name == "characters")
	    {
	    	for (var row : Transform in child) 
			{
				for (var character : Transform in row) 
				{
					characters.Add(character);
					charAnims.Add(character.GetComponent.<Animator>());
				}
			}
	    }
	}
}

function StopWalkingAnim ()
{
	for (var charAnim: Animator in charAnims) 
	{
		charAnim.Play("stop", 0);
	}
}

function StartWalkingAnim ()
{
	for (var charAnim: Animator in charAnims) 
	{
		charAnim.Play("start", 0);
	}
}

function StartTurning (newDirection: Direction)
{
	turnEnd = Time.time + turnDuration;
	var dirDiff: int = newDirection - direction;
	if (dirDiff > 2)
	{
		dirDiff -= 4;
	}
	else if (dirDiff < -2)
	{
		dirDiff += 4;
	}
	turnAngle = dirDiff * 90.0f;
	StopWalkingAnim();
}

function ChangeDirection (newDirection: Direction)
{
	if (turnEnd == 0.0f)
	{
		if (isOnCrossRoad)
		{
			//Debug.Log(Vector3.Distance(this.transform.position, crossRoadPos));
			if (Vector3.Distance(this.transform.position, crossRoadPos) <= maxCrossRoadDistanceToTurn)
			{
				StartTurning (newDirection);
				direction = newDirection;
			}
		}
		else
		{
			StartTurning (newDirection);
			direction = newDirection;
		}
	}
}

function Move (allowed: boolean, vel: Vector3)
{
	if (turnEnd == 0.0f)
	{
		if (allowed)
		{
			rb.velocity = vel;		
		}
		else
		{
			//Debug.Log(Vector3.Distance(this.transform.position, crossRoadPos));
			if (isOnCrossRoad && Vector3.Distance(this.transform.position, crossRoadPos) <= maxCrossRoadDistanceToStop)
			{
				rb.velocity = Vector3(0,0,0);
				StopWalkingAnim();
			}
		}
	}
	else
	{
		rb.velocity = Vector3(0,0,0);
		StopWalkingAnim();
	}
}

function Update () {
	Debug.Log("Dir " + direction + ", N " + north + ", E " + east + ", S " + south + ", W " + west);
	// crowd controls
	if (north && direction != Direction.North && (Input.GetKey (KeyCode.UpArrow) || Input.GetKey (KeyCode.W)))
	{
		ChangeDirection (Direction.North);
	}
	if (south && direction != Direction.South && (Input.GetKey (KeyCode.DownArrow) || Input.GetKey (KeyCode.S)))
	{
		ChangeDirection (Direction.South);
	}
	if (west && direction != Direction.West && (Input.GetKey (KeyCode.LeftArrow) || Input.GetKey (KeyCode.A)))
	{
		ChangeDirection (Direction.West);
	}
	if (east && direction != Direction.East && (Input.GetKey (KeyCode.RightArrow) || Input.GetKey (KeyCode.D)))
	{
		ChangeDirection (Direction.East);
	}
	// change rigidBody's velocity depending on the direction
	switch (direction)
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
	
	if (turnEnd != 0.0f)
	{
		if (turnEnd > Time.time)
		{
			for (var character in characters)
			{
				character.Rotate(Vector3.up * Time.deltaTime / turnDuration * turnAngle);
			}
		}
		else
		{
			turnEnd = 0.0f;
			StartWalkingAnim();
			// adjust the rotation to be at the right angle (N*90)
			var yRot = characters[0].rotation.eulerAngles.y;
			var targetYRot = 0.0f;
			switch (direction)
			{
				case Direction.North:
				targetYRot = 0.0f;
				break;
				case Direction.East:
				targetYRot = 90.0f;
				break;
				case Direction.South:
				targetYRot = 180.0f;
				break;
				case Direction.West:
				targetYRot = 270.0f;
				break;
			}
			var yRotDiff = targetYRot - yRot;
			if (yRotDiff < -180.0f)
			{
				yRotDiff += 360.0f;
			}
			else if (yRotDiff > 180.0f)
			{
				yRotDiff -= 360.0f;
			}
			Debug.Log(yRotDiff);
			for (var character in characters)
			{
				character.Rotate(Vector3.up * yRotDiff);
			}	
			yRot = characters[0].rotation.eulerAngles.y % 90.0f;
			Debug.Log(yRot);
		}
	}
	
	if (finishEnd != 0.0f)
	{
		if (finishEnd > Time.time)
		{
			// wait for finish
		}
		else
		{
			// show finish screen
			game.Finished();
		}
	}
}

function RoadCollision(other: Collider)
{
	// get the road the crowd is standing on
	var road: Road = other.gameObject.GetComponent.<Road>();
	if (road.isFinish && finishEnd == 0.0f)
	{
		finishEnd = finishDuration + Time.time;
	}
	if (road.isTensionArea)
	{
		game.isInsideTensionArea = true;
	}
	else
	{
		game.isInsideTensionArea = false;
	}
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
}

function OnTriggerStay(other: Collider) {
	RoadCollision(other);
}

//function OnTriggerEnter(other: Collider) {
//	RoadCollision(other);
////	if (roadScale.x > roadScale.z)
////	{
////		transform.position.z = other.transform.position.z;
////	}
////	else if (roadScale.x < roadScale.z)
////	{
////		transform.position.x = other.transform.position.x;
////	}
//}
