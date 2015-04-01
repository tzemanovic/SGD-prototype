#pragma strict

var poundsPerSecond: float = 1000.0f;
var scoreText: UI.Text;
var isInsideTensionArea: boolean = false;
var tensionAreaMultiplier = 5.0f;

private var timeElapsed = 0.0f;

function Awake () {
	// keep this object for score screen, etc.
	DontDestroyOnLoad (this.transform.gameObject);
}

function Start () {
	
}

function Update () {
	timeElapsed += isInsideTensionArea ? tensionAreaMultiplier * Time.deltaTime : Time.deltaTime;
	if (scoreText != null)
	{
		scoreText.text = GetScoreText();
	}
}

public function GetScoreText(): String
{
	return "£" + Mathf.Round(GetScore()*100)/100;
}

public function GetScore(): float
{
	return (timeElapsed * poundsPerSecond);
}

public function Finished()
{
	Application.LoadLevel("outro");
}