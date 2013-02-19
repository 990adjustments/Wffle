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
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


// Hungry, Hungry…
{

  function Wffle(thisObj)
  {
    // Globals
    var scriptName = "Wffle v1.0";
    var frames = 1813;
    var timecode = 1812;
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

      "This script requires After Effects CS3 or later.\n\n" +

      "If you only have one layer in your comp:\n\n" +

         "* Enter the time at which you want the loop to begin\n" +
         "* Enter an optional dissolve length. Default is 1.5 sec\n" +
         "* Loop it!\n\n" +

      "If you have multiple layers in the comp:\n\n" +

         "* Select the layer you want to loop\n" +
         "* Enter the time at which you want the loop to begin\n" +
         "* Enter an optional dissolve length. Default is 1.5 sec\n" +
         "* Loop it!\n\n" +

      "As with many effects, the blend effect will not read any effects or a time-remap applied to " +
      "blend layer source. If the layer is not looping, check to make sure no effects are present. " +
      "Otherwise, precomp the layer.\n\n" +

      "If your Display Style in your composition settings is set to timecode, enter your values in seconds.\n\n" +
      "If your Display Style is in frames, then enter the values as frames.";


    function GetLoopPoint()
    {
      // Determine time display
      var timeDisplay = app.project.timeDisplayType;
      var tx = parseFloat(this.text);

      if (timeDisplay == timecode)
        loopValueTx = tx;
      else if (timeDisplay == frames) {
        var item = app.project.activeItem;
        loopValueTx = tx * item.frameDuration;
      }
    }

    function GetDissolve()
    {
      var timeDisplay = app.project.timecodeDisplayType;
      var tx = parseFloat(this.text);

      if (timeDisplay == timecode)
        dissolveValueTx = tx;
      else if (timeDisplay == frames) {
        var item = app.project.activeItem;
        dissolveValueTx = tx * item.frameDuration;
      }
    }

    function addBlend(activeItem, loopLayer, loopValue, dissolveValue)
    {
      var effectsGroup = loopLayer.property("ADBE Effect Parade");
      if (effectsGroup != null) {
        if (effectsGroup.canAddProperty("Blend")) {
          var effectBase = effectsGroup.addProperty("Blend");
          if (effectBase != null) {
            // Subtract one frame from outpoint
            var loopLayerOutPoint = loopLayer.outPoint - activeItem.frameDuration;

            // Set some keyframes
            effectBase.property("ADBE Blend-0001").setValue(loopLayer.index + 1);
            effectBase.property("ADBE Blend-0003").setValueAtTime((loopLayerOutPoint - dissolveValue), 1);
            effectBase.property("ADBE Blend-0003").setValueAtTime(loopLayerOutPoint, 0);

            // Ease those bitches!
            effectBase.property("ADBE Blend-0003").setTemporalEaseAtKey(1,[easeIn],[easeOut]);
            effectBase.property("ADBE Blend-0003").setTemporalEaseAtKey(2,[easeIn],[easeOut]);

            // This should not be in here but I'll leave it in for now.
            var loopMarker = new MarkerValue("Loop Point");
            loopLayer.property("Marker").setValueAtTime(loopValue, loopMarker);
          }
        }
      }
    }

    // Core
    function WffleCreateLoop(thisObj)
    {
      clearOutput();

      var activeComp = app.project.activeItem;

      if (activeComp != null && (activeComp instanceof CompItem)) {
        app.beginUndoGroup(scriptName);

        var loopValue = loopValueTx;
        if (isNaN(loopValue) || loopValue < activeComp.frameDuration) {
          alert("Please enter a valid loop point.", scriptName);
          return;
        }

        var dissolveValue = dissolveValueTx;
        if (isNaN(dissolveValue) || dissolveValue < activeComp.frameDuration) {
          dissolveValue = 1.5;
        }

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
          addBlend(activeComp, loopLayer, loopValue, dissolveValue);
        }
        // Deal with multiple layers in comp
        else if (activeComp.numLayers > 1) {
          var selLayers = activeComp.selectedLayers;
          if (selLayers.length == 0) {
            alert("Please select a layer to create loop.", scriptName);
            return;
          }
          else if (selLayers.length > 1) {
            alert("You have more than one layer selected. Please select just one layer.", scriptName);
            return;
          }

          if (selLayers.length == 1) {
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
            addBlend(activeComp, loopLayer, loopValue, dissolveValue);
          }
        }
        else
          alert("Your comp contains no layers.", scriptName);

        app.endUndoGroup();

      } else
          alert("Please select an active comp to use this script.", scriptName);
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
                  st: StaticText { text: 'Loop Point:', helpTip: 'Set loop point time.' }, \
                  loopptET: EditText { characters: 10, justify: 'left', helpTip: 'Set loop point time.'}  \
                 }, \
                 dissolve: Group { orientation: 'row', \
                         st: StaticText { text: 'Dissolve:', helpTip: 'Set dissolve length.' }, \
                         dissolveET: EditText { characters: 10, justify: 'left', helpTip: 'Set dissolve length.' } \
                 } \
              }, \
              buttons: Group { orientation: 'row', spacing: 61, \
                helpbt: Button { text: '?', alignment: ['left','fill'], preferredSize: [30, 20] }, \
                loopbt: Button { text: 'Loop it!', alignment: ['right','center'], preferredSize:[90,20], properties: {name: 'loopIt'} } \
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
      alert("Bummer, could not open the user interface for Wffle.", scriptName);
    }
  }

  Wffle(this);

}
// Hippo!
