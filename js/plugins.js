// File: plugins.js
// Purpose: Shared plugins throughout the package


//-------------------------------Function isset-------------------------------//
// Purpose: Determines if a variable has been set/initialized
// PARAMETERS:
// 		Var: A variable of any type.
// Postcondition: Returns boolean true if the variable is set. False otherwise.
//----------------------------------------------------------------------------//
function isset(Var)
{
	return !(typeof Var == 'undefined' || Var === null  || Var === "");
}
