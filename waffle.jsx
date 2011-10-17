//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Name: Waffle
// Author: Erwin Santacruz
// Date: 10.13.11
// Website: http://www.990adjustments.com /
// Email: hi@990adjustments.com
//
// Description:
// Creates a loop from a layer using the blend effect.
// Good for when you can only dissolve to get a loop
// and the layers contain transparency.
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
//TODO: Rework the interface.

// Hungry, Hungry…
{

  var scriptName = "Waffle v0.5";
  var pal;
  var loopBtn;
  var loopValueTx;
  var dissolveValueTx;
  var easeIn = new KeyframeEase(0, 33.33333);
  var easeOut = new KeyframeEase(0, 33.33333);

  function createLoop(thisObj)
  {
    clearOutput();

    var activeComp = app.project.activeItem;

    if (activeComp != null && (activeComp instanceof CompItem)) {
      app.beginUndoGroup(scriptName);

      var loopValue = parseFloat(loopValueTx.text);
      if (isNaN(loopValue) || loopValue < 0.1) {
        Window.alert("Please enter a valid loop point.", "Waffle");
        return;
      }

      var dissolveValue = parseFloat(dissolveValueTx.text)
      if (isNaN(dissolveValue) || dissolveValue < 0)
        dissolveValue = 1.5;

      // Single layer in comp
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

              effectBase.property("ADBE Blend-0003").setTemporalEaseAtKey(1,[easeIn],[easeOut]);
              effectBase.property("ADBE Blend-0003").setTemporalEaseAtKey(2,[easeIn],[easeOut]);

              var loopMarker = new MarkerValue("Loop Point");
              loopLayer.property("Marker").setValueAtTime(loopValue, loopMarker);
            }
          }
        }
      }
      // Multiple layers in comp
      else if (activeComp.numLayers > 1) {
        var selLayers = activeComp.selectedLayers;
        if (selLayers.length == 0) {
          Window.alert("Please select a layer to create loop.");
          return;
        }

        if (selLayers.length == 1) {
          // Yuck! Repeated code. Need to refactor. But making it work for now.
          //var blendLayer = selLayers[0];
          var loopLayer = selLayers[0];
          //blendLayer.duplicate();
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

          //var loopLayer = firstLayer; //activeComp.layer(1);
          var effectsGroup = loopLayer.property("ADBE Effect Parade");
          if (effectsGroup != null) {
            if (effectsGroup.canAddProperty("Blend")) {
              var effectBase = effectsGroup.addProperty("Blend");
              if (effectBase != null) {
                // Set some keyframes
                effectBase.property("ADBE Blend-0001").setValue(loopLayer.index + 1);
                effectBase.property("ADBE Blend-0003").setValueAtTime((loopLayer.outPoint - dissolveValue), 1);
                effectBase.property("ADBE Blend-0003").setValueAtTime(loopLayer.outPoint, 0);

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
        alert("Please select an active comp to use this script.");
  }

  // Create dialog
  function createUI(thisObj)
  {
    pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, [100,100,380,245], {resizeable:true});

    if (pal != null) {
      panel = pal.add("panel", [10,10,255,100], "");
      loopTxt = pal.add("statictext", [20, 30, 95, 40], "Loop Point:");
      loopValueTx = pal.add('edittext', [loopTxt.bounds.right + 5, 30, 155, 50]);

      dissolveTx = pal.add("statictext", [20, loopValueTx.bounds.bottom + 20, 95, loopValueTx.bounds.bottom + 30], "Dissolve:");
      dissolveValueTx = pal.add('edittext', [dissolveTx.bounds.right + 5, loopValueTx.bounds.bottom + 20, 155, loopValueTx.bounds.bottom + 40]);

      loopBtn = pal.add("button", [10, dissolveValueTx.bounds.bottom + 20, 255, dissolveValueTx.bounds.bottom + 80], "Loop it!");

      loopBtn.onClick = function()
      {
        createLoop(this);
      };
    }

    return pal;
  }

  var win=createUI(this);
  if(win instanceof Window) win.show();

}
// Hippo!
