// Create an object to hold the current state of the application
const state = {
  selectedInput: null,
  selectedOutput: null,
  controls: [
    {
      type: "knob",
      id: "knob1",
      channel: 1,
      cc: 1,
      value: 64
    },
    {
      type: "knob",
      id: "knob2",
      channel: 1,
      cc: 2,
      value: 64
    },
    {
      type: "slider",
      id: "slider1",
      channel: 1,
      cc: 3,
      value: 64
    },
    {
      type: "slider",
      id: "slider2",
      channel: 1,
      cc: 4,
      value: 64
    },
    {
      type: "text",
      id: "text1",
      channel: 1,
      nrpn: [0, 1],
      value: 0
    },
    {
      type: "text",
      id: "text2",
      channel: 1,
      nrpn: [0, 2],
      value: 0
    }
  ]
};

function initMIDI() {
  if (WebMidi.enabled) {
    console.log("WebMidi already enabled!")
  }

  // EventEmitter isn't available, so this is the only way I've found to monitor the events that are fired during startup
  [
    "midiaccessgranted",
    "connected",
    "enabled",
    "disconnected",
    "error",
    "disabled",
    "portschanged",
  ].forEach(evnt =>
    WebMidi.addListener(evnt, e => {
      extra_msg = `target: inputs I: ${e.target.interface}  outputs: ${e.target.interface}`
      if ('error' in e) {
        extra_msg = `error: ${e.error}`
      }
      console.log(`== WebMidi event: ${e.type}  timestamp: ${e.timestamp}  ${extra_msg}`)
    })
  )

  // Enable WEBMIDI.js and trigger the onWebMidiEnabled() function when ready
  WebMidi
    .enable({ sysex: true })
    .then(onMIDISuccess(), onMIDIFailure)
    .catch(err => alert(err));

  // HACK: Chrome loads and finished promise; Firefox load but never executes "then"
  var wait_seconds = 5;
  setTimeout(() => {
    if (WebMidi.enabled) {
      console.log(`((After waiting ${wait_seconds} seconds:) WebMidi enabled!`)
      onMIDISuccess(); // Firefox hack
    } else {
      console.log(`WebMidi still not enabled after ${wait_seconds} seconds`)
    }
  }, wait_seconds * 1000);
}


// Function to initialize the application
function init() {
  // Initialize WebMIDI
  initMIDI()

  // Add event listeners for the tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", event => {
      // Set the active tab
      setActiveTab(event.currentTarget);

      // Update the UI
      updateUI();
    });
  });

  // Add event listeners for the buttons
  const buttons = document.querySelectorAll(".button");
  buttons.forEach(button => {
    button.addEventListener("click", event => {
      // Get the control associated with the button
      const controlId = event.currentTarget.dataset.controlId;
      const control = state.controls.find(c => c.id === controlId);

      // Update the control value based on the button
      if (event.currentTarget.classList.contains("plus")) {
        control.value = Math.min(127, control.value + 1);
      } else if (event.currentTarget.classList.contains("minus")) {
        control.value = Math.max(0, control.value - 1);
      }

      // Update the UI
      updateUI();

      // Send the MIDI message
      sendMIDIMessage(control);
    });
  });
}

// Function to handle successful WebMIDI initialization
function onMIDISuccess() {
  // Set up MIDI input and output lists
  const inputList = document.getElementById("input-select");
  const outputList = document.getElementById("output-select");

  // Add event listeners for MIDI inputs and outputs
  WebMidi.inputs.forEach(input => {
    input.onmidimessage = state.handleMidiMessage;
    addDeviceToList(inputList, input);
  });
  WebMidi.outputs.forEach(output => {
    addDeviceToList(outputList, output);
  });

  // Update the UI
  updateUI();
}

// Function to handle failed WebMIDI initialization
function onMIDIFailure() {
  console.error("Failed to initialize WebMIDI");
}

//// Function to add a MIDI device to a list
function addDeviceToList(select, device) {
  const option = document.createElement('option');
  option.text = device.name;
  option.value = device.id;
  option.setAttribute('data-device-id', device.id);
  select.add(option);
}



function setActiveTab(tab) {
  const activeTab = document.querySelector(".active");
  if (activeTab) {
    activeTab.classList.remove("active");
  }
  tab.classList.add("active");
}


function updateUI() {
  // Get the active tab
  const activeTab = document.querySelector(".tab.active");

  // Get the controls associated with the active tab
  const controls = state.controls.filter(control => control.tab === activeTab.id);

  // Update the values of the controls
  controls.forEach(control => {
    // Find the UI element for the control
    const controlElement = document.querySelector(`[data-control-id="${control.id}"]`);

    // Update the UI element based on the control value
    if (controlElement.classList.contains("knob")) {
      controlElement.style.setProperty("--knob-angle", `${(control.value / 127) * 270 - 135}deg`);
    } else if (controlElement.classList.contains("slider")) {
      controlElement.value = control.value;
    } else if (controlElement.classList.contains("display")) {
      controlElement.textContent = control.value;
    }
  });
}



document.addEventListener("DOMContentLoaded", init);