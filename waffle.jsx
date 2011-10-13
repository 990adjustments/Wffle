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

// Hungry, Hungry…
{

  var pal;
  var loopBtn;
  var loopValueTx;
  var dissolveValueTx;

  function createLoop(thisObj)
  {
    clearOutput();

    var scriptName = "Waffle";
    var activeComp = app.project.activeItem;

    if (activeComp != null && (activeComp instanceof CompItem)) {
      app.beginUndoGroup(scriptName);

      var loopValue = parseInt(loopValueTx.text);
      if (isNaN(loopValue)) {
        Window.alert("Please enter a valid loop point.");
        return;
      }

      var dissolveValue = parseInt(dissolveValueTx.text)
      if (isNaN(dissolveValue))
        dissolveValue = 1.5;

      var blendLayer = activeComp.layer(1);
      blendLayer.duplicate();
      blendLayer.enabled = false;

      var outpoint = blendLayer.outPoint
      // Subtract one frame from loop point given
      var loopPoint = loopValue - activeComp.frameDuration;
      blendLayer.inPoint = loopPoint
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
              // TODO: Easy Ease the keyframes
              effectBase.property("ADBE Blend-0001").setValue(2);
              effectBase.property("ADBE Blend-0003").setValueAtTime((loopLayer.outPoint - dissolveValue), 1);
              effectBase.property("ADBE Blend-0003").setValueAtTime(loopLayer.outPoint, 0);

              var loopMarker = new MarkerValue("Loop Point");
              loopLayer.property("Marker").setValueAtTime(loopValue, loopMarker);
            }
        }

      app.endUndoGroup();

      } else
        alert("Please select an active comp to use this script.");
    }

  }

  // Create dialog
  function createUI(thisObj)
  {
    pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Waffle", [100,100,380,245], {resizeable:true});

    if (pal != null) {
      //panel = win.add("panel", [25,15,255,130], "WafflePanel");
      //TODO: Rework the interface.
      loopTxt = pal.add("statictext", [20, 20, 95, 40], "Loop Point:");
      loopValueTx = pal.add('edittext', [loopTxt.bounds.right + 5, 20, 150, 40]);

      dissolveTx = pal.add("statictext", [20, loopValueTx.bounds.bottom + 10, 95, loopValueTx.bounds.bottom + 30], "Dissolve:");
      dissolveValueTx = pal.add('edittext', [dissolveTx.bounds.right + 5, loopValueTx.bounds.bottom + 10, 150, loopValueTx.bounds.bottom + 30]);

      loopBtn = pal.add("button", [dissolveTx.bounds.right + 5, dissolveValueTx.bounds.bottom + 10, 170, dissolveValueTx.bounds.bottom + 30], "Loop it!");

      loopBtn.onClick = function()
      {
        createLoop(this);
        //clearOutput();
        //writeLn("Loop created.");

      };
    }

    return pal;
  }

  var win=createUI(this);
  if(win instanceof Window) win.show();

}
// Hippo!
