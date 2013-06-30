Wffle
======
**1.0.2 for After Effects**

Welcome
-------

Sometimes you need to create a loop from a source that has no loop
point and the only way to create the loop is to dissolve between a
duplicate of the source. If the source has transparency, it becomes
a problem.

Wffle is a simple After Effects script that uses the blend effect to create a
seamless loop of your source even with transparency. Can you easily
create the process by hand? Of course you can, this just automates it!

Installation
------------

This script requires After Effects CS3 or later.

Just place the script in your After Effects scripts directory.
The script is also dockable so you can place the script in
the After Effects ScriptUI folder.

How do I use Wffle
-------------------

If you only have one layer in your comp:

 * Enter the time at which you want the loop to begin
 * Enter an optional dissolve length. Default is 1.5 sec
 * Loop it!

If you have multiple layers in the comp:

 * Select the layer you want to loop
 * Enter the time at which you want the loop to begin
 * Enter an optional dissolve length. Default is 1.5 sec
 * Loop it!


As with many effects, the blend effect will not read any effects or a time-remap
applied to blend layer source. If the layer is not looping, check to make sure no
effects are present. Otherwise, precomp the layer.

If your Display Style in your composition settings is set to timecode, enter your
values in seconds. If your Display Style is in frames, then enter the values as frames.

Version History
---------------

Wffle 1.0.2

 * Fixed issues with using frames vs. timecode in comps.

Wffle 1.0.1

 * Fixed method name from timcodeDisplayType to timeDisplayType which was renamed in API.

Wffle 1.0

 * First "official" release!

Contact, Suggestions, Bugs,
---------------------------

E-Mail: hi@990adjustments.com  
Web: [http://www.990adjustments.com/](http://www.990adjustments.com/)  
Twitter: [@990adjustments](http://www.twitter.com/990adjustments/)

Legal
-----

THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL 990ADJUSTMENTS OR ERWIN SANTACRUZ AND CONTRIBUTORS
BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

990adjustments All rights reserved. Copyright © 2011
