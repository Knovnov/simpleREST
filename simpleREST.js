const Joi = require("joi"); //returns a class
const express = require("express"); //returns a function
const app = express();//called app by convention, an object
app.use(express.json()); //allows for parsing of json objects in the body of requests or something

const courses = [
  {id: 1, name: "course1"},
  {id: 2, name: "course2"},
  {id: 3, name: "course3"},
]

//endpoint and "callback function", called when this endpoint is called
app.get("/", (req, res) => {
  res.send("Hellow, worwold!!!");
});
app.get("/api/courses", (req, res) => {
  res.send(courses);
})
app.get("/api/courses/:id", (req, res) => {
  //find for javascript arrays (where c is the entire input array), if returns true returns the match
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) { //404 error, if course doesn't exist
    res.status(404).send("this is a special extra message");
    return;
  }
  res.send(course);

});

//basically treats :year and :month as inputs (route parameters), spits them back out
app.get("/api/courses/:year/:month", (req, res) => { 
  res.send(req.params);
  //res.send(req.params.month);
  
  //queries are like optional parameters
  //res.send(req.query);
});

app.post("/api/courses", (req, res) => {
  //schema thing
  //const schema = Joi.object({
  //  name: Joi.string().min(3).required()
  //});
  //const result = schema.validate(req.body);
  //if (result.error) {
  //  res.status(400).send(result.error.details[0].message);
  //}

  //equivalent code
  const {error} = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course); //appends to array
  res.send(course); // also gets sent back in a response
});

app.put("/api/courses/:id", (req, res) => {
  //look up course, if doesn't exist 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) { //404 error, if course doesn't exist
    res.status(404).send("this is a special extra message");
    return;
  }

  //object destructuring, returns the one thing from the schema object we care about, error
  const {error} = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  course.name = req.body.name
  res.send(course);

});

//id is a parameter
app.delete("/api/courses/:id", (req, res) => {
  //check if course exists
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) { //404 error, if course doesn't exist
    res.status(404).send("this is a special extra message");
    return;
  }
  //if exists, deletes the course, and returns what was deleted
  const index = courses.indexOf(course);
  courses.splice(index, 1); //deletes

  res.send(course);
});

function validateCourse(course) {
  //validate (could be 400 error)
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return schema.validate(course);
}


//either uses environment variable (called PORT, if present) or localhost:3000
const port = process.env.PORT || 3000;
//causes app to listen on port, second is a function that runs when first starts listening
app.listen(port, () => console.log(`Listening on port ${port}`));
