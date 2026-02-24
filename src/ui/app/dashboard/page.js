"use client"
import mockData from "./bob-data-mock.json";

export default function Dashboard() {

  function handleClick( user ) {
    alert( "this will open up a modal window for the AOR change for: " + user + "!!!" );
  }

  return(
    <div>
      <main>
        <div>
          {/* Move this table into a seperate component file */}
          <h2>My Business:</h2>
          <table>
            <thead>
              <tr>
                <td>Agent/Advisor Name</td>
                <td>Agent/Advisor ID</td>
                <td>Agency Name</td>
                <td>Policy/Contract Number</td>
                <td>Actions</td>
              </tr>
            </thead>
            { mockData.data.map( ( data ) => (
              <tbody>
                <tr>
                  <td>{ data.agentName }</td>
                  <td>{ data.agentId }</td>
                  <td>{ data.agencyName }</td>
                  <td>{ data.policyNumber }</td>
                  <td>
                    <button onClick={ () => handleClick( data.agentName ) }>Reassign</button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
          <br/>
          <br/>
          <br/>
          <a href="/dashboard/reassignment">Next page ...</a>
        </div>
      </main>
    </div>
  );
}
