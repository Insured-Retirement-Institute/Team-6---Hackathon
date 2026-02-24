export default function Step1() {
  return(
    <div>
      <label htmlFor="reassignmentDropDown"><i>* Select a Reassignment Reason</i></label>
      <br/>
      <select id="reassignmentDropDown">
        <option value="">-- Reassignment Reason --</option>
        <option value="">Agent Change</option>
        <option value="">Another Agent Change</option>
        <option value="">Some Other Agent Change</option>
        <option value="">Other</option>
      </select>
      <br/>
      <br/>
      <br/>
      <label htmlFor="reassignmentName"><i>* Search for an account</i></label>
      <br/>
      <input type="search" placeholder="account number" id="reassignmentName"></input>
      <br/>
      <br/>
      <br/>
      <button onClick={ () => { alert( "this button will check if the selected reassignment is OK to service" ) } }>next</button>
    </div>
  );
}
