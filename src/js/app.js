// Create an object to hold the state of the application
state = {
  midiDevices: {
    input: [],
    output: [],
    selected: {
      input: null,
      output: null
    }
  },
  handleMidiMessage: onMIDIMessage
};



// Populate & add listener to the MIDI device select control
function populateDeviceSelectControl(selectControlId, deviceType){
  // Get references to the HTML <select> element for MIDI device
  selectControl = document.getElementById(selectControlId);
  midiDevices = state.midiDevices[deviceType];

  // Loop through the input devices and add options to the input <select> element
  for (var device of midiDevices) {
    var option = document.createElement('option');
    option.value = device.id;
    option.text = device.name;
    selectControl.appendChild(option);
  }

  addDeviceSelectControlListener(selectControlId, deviceType);
}

function addDeviceSelectControlListener(selectControlId, deviceType){
  // Listen for changes to the select control
  selectControl.addEventListener('change', (event) => {
    const midiDevice = state.midiDevices[deviceType][event.target.selectedIndex - 1];
    
    //TODO: remove listener from previous MIDI device
    state.midiDevices.selected[deviceType] = midiDevice;
    console.log(`=== User selected MIDI ${deviceType} device: '${midiDevice.name}'`);

    // Listen for MIDI messages from the selected MIDI device (inpute only)
    if ( deviceType == 'input') {
      removeAllMidiInputListeners();
      midiDevice.onmidimessage = state.handleMidiMessage;
    } else {        
      if (midiDevice) {
        console.log(`=== Sending MIDI note to ${midiDevice.name}`);
        midiDevice.send([0x90, 0x45, 0x7f]);
      }
    }
  });
}

function discoverMidiDevices(midiDevices, deviceType){
  for (var device = midiDevices.next(); device && !device.done; device = midiDevices.next()) {
    state.midiDevices[deviceType].push(device.value);   
    //if (!device.value.name.includes('WebMIDI')) {
      console.log(`- ${deviceType}: ${device.value.name}`);
    //}
  }
}



function removeAllMidiInputListeners() {
  const inputs = state.midiAccess.inputs.values();
  for (let input of inputs) {
    input.onmidimessage = null;
  }
}


function onMIDIMessage(event) {

  let str = `MIDI message received at timestamp [${event.target.name}] ${event.timeStamp}[${event.data.length} bytes]: `;
  for (const character of event.data) {
    str += `0x${character.toString(16)} `;
  }
  const TIMING_CLOCK = 0xF8;
  if( event.data != TIMING_CLOCK ){
    console.log(str);
  }
}


function initDevices(event) {
  midiAccess = state.midiAccess
  // Get a list of MIDI input and output devices
  var inputs = midiAccess.inputs.values();
  var outputs = midiAccess.outputs.values();

  // Loop through the input devices and add them to the state object
  discoverMidiDevices(inputs, 'input');
  discoverMidiDevices(outputs, 'output');

  // Populate & add listener to the MIDI device select control
  populateDeviceSelectControl('input-select', 'input');
  populateDeviceSelectControl('output-select', 'output');
}

// Create a function to initialize the application
function initApp() {
  // Request MIDI access
  navigator.requestMIDIAccess({sysex: true}).then((midiAccess) => {
    state.midiAccess = midiAccess;
    initDevices();
    midiAccess.onstatechange = (event) => initDevices;
  })
  .catch(function(error) {    
    console.error(error);
  });
  
}

// Call the initApp function when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initApp();
});
