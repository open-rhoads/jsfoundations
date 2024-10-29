// produces random number between 0 (including) and 1 (excluding)
const randomNumber = Math.random();
console.log(randomNumber);
//#1 add conditional logic to alert if > 0.7
// if (randomNumber > 0.7) {
//   alert('The generated number is above the max of 0.7.');
// }
//#2 two ways to loop through an array
const arrayNums = [5, 6, 7, 8];
//for loop through the array
for (let i = 0; i <= arrayNums.length; i++) {
  console.log(arrayNums[i]);
}
//for of loop through the array
for (num of arrayNums) {
  console.log(num);
}
//#3 adjust the loop to go backwards using the for loop
for (let i = arrayNums.length; i >= 0; i--) {
  console.log(arrayNums[i]);
}
//#4 second random number and additional more complex comparison/alert
const randomNumberTwo = Math.random();
console.log(randomNumberTwo);
if (
  (randomNumber > 0.7 && randomNumberTwo > 0.7) ||
  (randomNumber <= 0.2 || randomNumberTwo <= 0.2)
) {
  alert('Both numbers are too high... OR one is too low.');
}
