//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Name: Wffle
// Author: Erwin Santacruz
// Date: 10.13.11
// Website: http://www.990adjustments.com/
// Email: hi@990adjustments.com
//
// Description:
// Creates a loop from a layer using the blend effect.
// Good for when you can only dissolve between to items
// to get a loop and the layers contain transparency.
//
// Legal Mumbo Jumbo:
// THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL 990ADJUSTMENTS OR ERWIN SANTACRUZ AND CONTRIBUTORS
// BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


//TODO: Seriously refactor!

// Hungry, Hungry…
{

  function Wffle(thisObj)
  {
    var frames = 1813;
    var timecode = 1812
    var scriptName = "Wffle v0.5";
    var loopBtn;
    var loopValueTx;
    var dissolveValueTx;
    var easeIn = new KeyframeEase(0, 33.33333);
    var easeOut = new KeyframeEase(0, 33.33333);
    var helpString =
      "Wffle\n" +
      "1.0 for After Effects\n" +
      "Copyright (c) 2011 990adjustments (Erwin Santacruz). All rights reserved\n" +
      "\n" +
      "If you only have one layer in your comp:\n\n" +

         "* Enter the point at which you want the loop to begin in seconds\n" +
         "* Optionally, enter a dissolve value. Default is 1.5 seconds if left blank\n" +
         "* Loop it!\n\n" +

      "If you have multiple layers in the comp:\n\n" +

         "* You must first select the layer you want to loop\n" +
         "* Enter the point at which you want the loop to begin in seconds\n" +
         "* Optionally, enter a dissolve value. Default is 1.5 seconds if left blank\n" +
         "* Loop it!\n\n" +

      "As with many effects, the blend effect will not read any effects or a time-remap applied to " +
      "blend layer source. If the layer is not looping, check to make sure no effects are present. " +
      "Otherwise, precomp the layer.\n\n" +

      "The loop point and dissolve values are given in seconds.";

    function GetLoopPoint()
    {
      var tx = parseFloat(this.text);
      loopValueTx = tx;
    }

    function GetDissolve()
    {
      var tx = parseFloat(this.text);
      dissolveValueTx = tx;
    }

    // Core
    function WffleCreateLoop(thisObj)
    {
      clearOutput();

      var activeComp = app.project.activeItem;

      if (activeComp != null && (activeComp instanceof CompItem)) {
        app.beginUndoGroup(scriptName);

        var loopValue = loopValueTx;
        if (isNaN(loopValue) || loopValue < 0.1) {
          alert("Please enter a valid loop point.", scriptName);
          return;
        }

        var dissolveValue = dissolveValueTx;
        if (isNaN(dissolveValue) || dissolveValue < 0)
          dissolveValue = 1.5;

        // If there is only one layer in comp
        if (activeComp.numLayers == 1) {
          var blendLayer = activeComp.layer(1);
          blendLayer.duplicate();
          blendLayer.enabled = false;

          // Shift trimmed layer to end
          var outpoint = blendLayer.outPoint
          // Subtract one frame from loop point given
          var loopPoint = loopValue - activeComp.frameDuration;
          blendLayer.inPoint = loopPoint;
          blendLayer.startTime =  outpoint - loopValue;

          // Set work area
          activeComp.workAreaStart = loopValue;
          activeComp.workAreaDuration = (outpoint - loopValue) -  activeComp.frameDuration;

          // Grab the top layer
          var loopLayer = activeComp.layer(1);
          var effectsGroup = loopLayer.property("ADBE Effect Parade");
          if (effectsGroup != null) {
            if (effectsGroup.canAddProperty("Blend")) {
              var effectBase = effectsGroup.addProperty("Blend");
              if (effectBase != null) {
                // Set some keyframes
                effectBase.property("ADBE Blend-0001").setValue(loopLayer.index + 1);
                effectBase.property("ADBE Blend-0003").setValueAtTime((loopLayer.outPoint - dissolveValue), 1);
                effectBase.property("ADBE Blend-0003").setValueAtTime(loopLayer.outPoint, 0);

                // Ease those bitches!
                effectBase.property("ADBE Blend-0003").setTemporalEaseAtKey(1,[easeIn],[easeOut]);
                effectBase.property("ADBE Blend-0003").setTemporalEaseAtKey(2,[easeIn],[easeOut]);

                var loopMarker = new MarkerValue("Loop Point");
                loopLayer.property("Marker").setValueAtTime(loopValue, loopMarker);
              }
            }
          }
        }
        // Deal with multiple layers in comp
        else if (activeComp.numLayers > 1) {
          var selLayers = activeComp.selectedLayers;
          if (selLayers.length == 0) {
            Window.alert("Please select a layer to create loop.");
            return;
          }

          if (selLayers.length == 1) {
            // Yuck! Repeated code. Need to refactor. But making it work for now.
            var loopLayer = selLayers[0];
            var blendLayer = loopLayer.duplicate();
            blendLayer.enabled = false;

            // Shift trimmed layer to end
            var outpoint = blendLayer.outPoint;
            // Subtract one frame from loop point given
            var loopPoint = loopValue - activeComp.frameDuration;
            blendLayer.inPoint = loopPoint
            blendLayer.startTime =  outpoint - loopValue;
            blendLayer.moveAfter(loopLayer);

            // Set work area
            activeComp.workAreaStart = loopValue;
            activeComp.workAreaDuration = (outpoint - loopValue) -  activeComp.frameDuration;

            var effectsGroup = loopLayer.property("ADBE Effect Parade");
            if (effectsGroup != null) {
              if (effectsGroup.canAddProperty("Blend")) {
                var effectBase = effectsGroup.addProperty("Blend");
                if (effectBase != null) {
                  // Set some keyframes
                  effectBase.property("ADBE Blend-0001").setValue(loopLayer.index + 1);
                  effectBase.property("ADBE Blend-0003").setValueAtTime((loopLayer.outPoint - dissolveValue), 1);
                  effectBase.property("ADBE Blend-0003").setValueAtTime(loopLayer.outPoint, 0);

                  // Ease those bitches! I really should not be writing this again
                  effectBase.property("ADBE Blend-0003").setTemporalEaseAtKey(1,[easeIn],[easeOut]);
                  effectBase.property("ADBE Blend-0003").setTemporalEaseAtKey(2,[easeIn],[easeOut]);

                  var loopMarker = new MarkerValue("Loop Point");
                  loopLayer.property("Marker").setValueAtTime(loopValue, loopMarker);
                }
              }
            }
          }
        }
        else
          Window.alert("Your comp contains no layers.");

        app.endUndoGroup();

      } else
          Window.alert("Please select an active comp to use this script.");
    }

    // Create UI
    function WffleBuildUI(thisObj)
    {
      var pal = (thisObj instanceof Panel) ? thisObj: new Window ("palette", "Wffle", undefined, {resizeable: true});
      if (pal != null)
        {
          var res =
            "group { text: 'Wffle', orientation: 'column', spacing: 5, \
              pnl: Panel { orientation: 'column', alignChildren: 'right', text: 'Options', \
                loopPoint: Group { orientation: 'row', \
                  st: StaticText { text: 'Loop Point:', properties: {helpTip: 'Time at where loop point will be created.'} } \
                  loopptET: EditText { characters: 10, justify: 'left'}  \
                 }, \
                 dissolve: Group { orientation: 'row', \
                         st: StaticText { text: 'Dissolve:' }, \
                         dissolveET: EditText { characters: 10, justify: 'left' } \
                 } \
              }, \
              buttons: Group { orientation: 'row', spacing: 60, \
                helpbt: Button { text: '?', alignment: ['left','fill'], preferredSize: [30, 30] }, \
                loopbt: Button { text: 'Loop it!', alignment: ['right','center'], preferredSize:[90,30], properties: {name: 'loopIt'} } \
              } \
            }";

            pal.grp = pal.add(res);

            pal.grp.pnl.loopPoint.loopptET.onChange = GetLoopPoint;
            pal.grp.pnl.dissolve.dissolveET.onChange = GetDissolve;
            pal.grp.buttons.helpbt.onClick = function() { alert(helpString); };
            pal.grp.buttons.loopbt.onClick = WffleCreateLoop;

            pal.layout.layout(true);
            pal.grp.minimumSize = pal.grp.size;
            pal.layout.resize();
            pal.onResizing = pal.onResize = function() {this.layout.resize();}
        }
        return pal;
    }

    if (parseFloat(app.version) < 8) {
      alert("This script requires After Effects CS3 or later.", scriptName);
      return
    }

    // Main
    var wfflePalette = WffleBuildUI(thisObj);
    if (wfflePalette != null) {
      if (wfflePalette instanceof Window) {
        wfflePalette.center();
        wfflePalette.show();
      }
      else {
        wfflePalette.layout.layout(true);
      }
    }
    else {
      alert("Could not open the user interface.", scriptName);
    }
  }

  Wffle(this);

}
// Hippo!
