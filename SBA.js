sba 308 javascript fundementals: 

vss code
//Check for cource id data validity.
function checkAssignmentId(assignmentGroup, courseInfo) {
    if (assignmentGroup.course_id != courseInfo.id) {
        throw new Error('Program Failed..... Course ID not present in Course Info Data. Please check.');
    } else {
        //console.log("Course ID Match..All Good");
    }
}
//Get unique learner id array.
function getUnqArrayOfLearnerID([learnerSubmissions]) {
    const unqLearnerIdArray = [];
    let unqLearnerId = 0;
    for (let i = 0; i < learnerSubmissions.length; i++) {
        //unqLearnerId=LearnerSubmissions[i].learner_id;
        if (unqLearnerId != learnerSubmissions[i].learner_id) {
            unqLearnerId = learnerSubmissions[i].learner_id;
            unqLearnerIdArray.push(unqLearnerId);
        }
    }
    return unqLearnerIdArray;
}
//function getAssignmentDetailsObject(assignmentGroup, assignMentId) {
//for (let i = 0; i < assignmentGroup.assignments.length; i++) {
//if (assignmentGroup.assignments[i].id == assignMentId) {
//return assignmentGroup.assignments[i];
//}
//}
//}
//Get the assignment details object
function getAssignmentDetailsObject(assignmentGroup, assignMentId) {
    let i = 0;
    do {
        if (assignmentGroup.assignments[i].id == assignMentId) {
            return assignmentGroup.assignments[i];
        }
        i++;
    } while (i < assignmentGroup.assignments.length)
}
//deduct marks based on late submission date.
function deductMarks(dueAtDate, submitteddate) {
    if (submitteddate > dueAtDate) {
        return 10;
    } else {
        return 0;
    }
}
//Calculate avarage for given assignment id.
function getAvarage(actualMarks, totalMarks, dueAtDate, submitteddate) {
    let val = 0;
    if (isNaN(actualMarks) || isNaN(totalMarks)) {
        throw new Error('Score and points_possible must be numbers only ');
    }
    if (totalMarks == 0) {
        throw new Error('Points Possible can not be 0. Please check the input data for validity');
    }
    actualMarks = actualMarks - deductMarks(dueAtDate, submitteddate);
    try {
        val = actualMarks / totalMarks;
    } catch (error) {
        console.error(error);
    }
    return val;
}
//Construct the object array containg learner details.
function getLearnerData(courseInfo, assignmentGroup, [learnerSubmissions]) {
    let finalResultArray = [];
    //Check for input data validity for course id.
    checkAssignmentId(assignmentGroup, courseInfo);
    let unqLearnerIdArray = getUnqArrayOfLearnerID([learnerSubmissions]);
    for (let i = 0; i < unqLearnerIdArray.length; i++) {
        let learnerID = unqLearnerIdArray[i];
        let myObject = { id: learnerID }; // create an object
        let totalActualMarks = 0;
        let totalPossibleMarks = 0;
        for (let i = 0; i < learnerSubmissions.length; i++) {
            if (learnerSubmissions[i].learner_id == learnerID) {
                let avg = getAvarage(learnerSubmissions[i].submission.score,
                    getAssignmentDetailsObject(assignmentGroup, learnerSubmissions[i].assignment_id).points_possible,
                    getAssignmentDetailsObject(assignmentGroup, learnerSubmissions[i].assignment_id).due_at,
                    learnerSubmissions[i].submission.submitted_at);
                totalActualMarks = totalActualMarks + learnerSubmissions[i].submission.score;
                totalPossibleMarks = totalPossibleMarks + getAssignmentDetailsObject(assignmentGroup, learnerSubmissions[i].assignment_id).points_possible;
                myObject[' ' + learnerSubmissions[i].assignment_id] = avg;
            } else {
                continue;
            }
        }
        myObject['avg'] = totalActualMarks / totalPossibleMarks;
        finalResultArray.push(myObject);
    }
    return finalResultArray;
}
const unqLearnerIdFinalResultArray = getLearnerData(CourseInfo, AssignmentGroup, [LearnerSubmissions]);
console.log("Program out put is ");
console.log(unqLearnerIdFinalResultArray);