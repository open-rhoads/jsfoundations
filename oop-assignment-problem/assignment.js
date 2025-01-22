// 1: "Course" class - three properties: "title", "length," and "price"
// Instantiate the class twice & output the objects to the console
class Course {
  #price = 0;
  constructor (titleVal, lengthVal, priceVal) {
    this.title = titleVal;
    this.length = lengthVal; //in weeks
    // 5: Use private fields to harden the getter/ setter approach from before.
    this.price = priceVal; //in dollars
  }

  // 2: Add two methods to the "Course" class: 
  // One calculates the length/price value & one method that outputs a summary including title, length, and price
  // Call these methods and output the result to the console
  pricePerLength() {
    const pricePerCourseLength = this.length / this.price;
    return pricePerCourseLength;
  }

  outputCourse() {
    //is this just in the console or should it create an element in the DOM...console for now
    console.log(`${this.title}: ${this.length} weeks, ${this.price},
  price per week: ${this.pricePerLength()}`);
  }

  // 4: Use getters and setters to ensure that the "price" property can only be set to a positive value and is returned with a "$" in front of it.
  set price(priceVal) {
    if (priceVal < 0) {
      throw 'Invalid value!';
    }
    this.#price = priceVal;
  }

  get price() {
    return `$${this.#price}`;
  }
}

const begHeelsDance = new Course('Beginning Heels Dance', 12, 200);
const intHeelsDance = new Course('Intermediate Heels Dance', 12, 200);
console.log(begHeelsDance);
console.log(intHeelsDance);
console.log(begHeelsDance.outputCourse());
console.log(intHeelsDance.outputCourse());
// console.log(`${begHeelsDance.title}: ${begHeelsDance.length} weeks, $${begHeelsDance.price}
// ${intHeelsDance.title}: ${intHeelsDance.length} weeks, $${intHeelsDance.price}`);

// 3: Create two more classes: "PracticalCourse" and "TheoreticalCourse" that extend the Course class
// "PracticalCourse" should also have a "numOfExercises" property, 
// "TheoreticalCourse" should have a "publish()" method (which prints something to the console)
class PracticalCourse extends Course {
  constructor(titleVal, lengthVal, priceVal, exercisesVal) {
    super(titleVal, lengthVal, priceVal);
    this.numOfExercises = exercisesVal;
  }
}

class TheoreticalCourse extends Course {
  //if there are no new properties, we don't need to redefine the constructor...
  // constructor(titleVal, lengthVal, priceVal) {
  //   super(titleVal, lengthVal, priceVal);
  // }

  publish() {
    console.log(`This theoretical course has been published.`);
  }
}
// Instantiate both and use the new AND old properties and methods
const advHeelsDance = new PracticalCourse('Advanced Heels Dance', 16, 300, 32);
const historyOfHeels = new TheoreticalCourse('History of Heels Dance', 8, 150);
advHeelsDance.outputCourse();
historyOfHeels.outputCourse();
historyOfHeels.publish();
console.log(historyOfHeels.price);
