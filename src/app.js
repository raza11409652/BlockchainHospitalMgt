App = {
  loading: false,
  contracts: {},
  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },
  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },
  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
    console.log(App.account);
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    // const todoList = await $.getJSON('TodoList.json')
    // App.contracts.TodoList = TruffleContract(todoList)
    // App.contracts.TodoList.setProvider(App.web3Provider)
    //
    // // Hydrate the smart contract with values from the blockchain
    // App.todoList = await App.contracts.TodoList.deployed()\
    const patientRecords = await $.getJSON('Patient.json')
    App.contracts.Patient = TruffleContract(patientRecords)
    App.contracts.Patient.setProvider(App.web3Provider)
    App.Patient = await App.contracts.Patient.deployed()
  },
  insertProblem: async ()=>{
      App.setLoading(true)
      console.log("Problem init");
      const user = $('#userRef').val();
      const problem = $('#problem').val();
      const suggestion = $('#suggestion').val();
      if(user ==null || user <1){
        return ;
      }
      await App.Patient. insertProblem(problem, suggestion , user , App.account)
        $('#reportGen').modal('hide');
        window.alert(`Report has been saved for ${user}`);
        window.location.reload();
        //  $('#medicalReport').modal('show');
  } ,

  createPatient: async()=>{
      App.setLoading(true)
    console.log("New Records entry started");
    const name  = $('#name').val();
    const age = $('#age').val();
    if(age<0 || age ==0){
      window.alert('Not valid age');

          window.location.reload()
                return ;
    }
    //await App.todoList.createTask(content);
    await App.Patient.createRecords(name  , age , App.account )
    window.location.reload()
  },
  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    //$('#account').html(App.account)
    $('#account').html("Logged In Account "+App.account)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  renderTasks: async () => {
    const patientCounts = await App.Patient.recordsCount();
    console.log(patientCounts);
    const record = $('#record');
    for(var i=patientCounts;i>=1 ; i--){
      const data = await App.Patient.records(i);
      console.log(data);
      const id = data[0];
      const name = data[1];
      const age = data[2];
      const createdBy = data[3];
      record.append( `<tr>
          <td>${id}</td>
          <td>${name}</td>
          <td>${age}</td>
          <td>${createdBy}</td>
          <td><a onclick='openReport(${id} )' class='btn btn-sm btn-primary text-white'>view</a>
            <a onclick='openDiag(${id} )' class='btn btn-sm btn-danger text-white'>Diagnose</a>
          </td>
        </tr>`)
    }
  },
  renderReoprt : async(id)=>{
    console.log("REport" + id)
    const reportCount = await App.Patient.problemCount();
    console.log("Report Count"+reportCount);
    $('#report').html('');
    for (var i=0 ;  i<=reportCount ; i++){

       const data =await App.Patient.problem(i);
       const reportid = data [0];
       const content = data[1];
       const suggestion = data[2] ;
       const userRef = data[3];
       const createdBy = data[4];
       console.log(`user ${userRef}`);
       if(userRef == id){
         //console.log("hello");
         $('#report').append(`
            <div class='mt-2 alert alert-primary'>
            <span class="float-right">${createdBy}</span>
              <h3>${reportid}</h3>
              <p>${content}</p>
              <p>${suggestion}</p>
            </div>
           `);
       }
      }
  } ,


  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}
 async function    openReport(id){
  console.log(id);
  $('#medicalReport').modal('show');
    await App.renderReoprt(id);
}
function openDiag (id ){
  console.log(id);
  console.log('creation start');
  $('#reportGen').modal('show');
  const userRef = $('#userRef');
  userRef.val(id);

}
$(() => {
  $(window).load(() => {
    App.load()
  })
})
