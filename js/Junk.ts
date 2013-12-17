class Person {
	firstName: string;
	lastName: string;
	constructor (firstName, lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
}

class Greeter extends Person {
	greeting: string;
	constructor (message: string) {
		this.greeting = message;
	}
	greet() {
		return "Hello, " + this.greeting;
	}
}  

