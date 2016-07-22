(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('TripDetailController', TripDetailController);

    /** @ngInject */
    function TripDetailController($scope, $interval, $stateParams, TripsService, $rootScope, NgMap) {

        $scope.selectedTrip
        function getDetails() {
            TripsService.getTripDetail({
                dId: $stateParams.driverId,
                rId: $stateParams.riderId,
            }, {id: $stateParams.id}, function (response) {
                $scope.selectedTrip = response
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        getDetails();

        function initialize() {
            var encodedString = 'ajwiCesymMXO?TDUBu@}A\\e@p@UlAa@n@e@d@WRS^O\\SVIRS\\`@V^Ff@Lb@H~@Xh@Jp@Zx@F`BRr@Pl@Pv@Lr@Kh@PbAD`ADTVG~@CZy@fAS|AB|@Kx@Oz@Kl@a@?u@Q{@Gu@IUUD]?m@Nk@P_@PWCVAUCb@Gp@Qh@Gj@VDu@?gA@A\\o@Dq@B[Sy@Ya@WmCa@cAU_@x@Mx@O`AO`Aq@[??eAG??cAs@k@A_@Gy@Qg@W}@M??]h@mApBm@|@m@p@[`A_@`@[j@c@d@m@t@e@r@_@t@e@dAmAzBu@x@mAl@w@p@gA~@??oAfAeAnAo@dA[VYZYfAe@dBsB|FWpAoAfFmAhA{@lAi@pA??y@p@g@~AQr@Vb@FTm@Jm@J{@n@m@bAg@dAo@`Aw@~@i@tAqA`Ck@jA}@dA_@nAy@lAk@bA{@fAy@xAaAhAy@bAaArAeAfAm@zAo@xAaAxAc@|@[d@m@Fi@Du@e@}@s@sAm@yAgA{AcAuA_AuBcB}Ay@qAcAyAcAuAaAsAaAwAcAoAaAoAcA{A{@gB}@sAgAyAmAsA_AaBkAkB}@uAiAyAgA}AmA}AcAaBiAyAgAwAeA}AkAcDgCsAsAyAgAkAsA}AyAqAoAkAuAsAqAiAwAgAkAmAsAoAiAmAiAiAuAiAiAcAyAkAuAuAuAqAuAkA}AeAyAuAqAqAuAsAsAkAsA{AkAqAyAgAqAiA_BcA{AwAqAkA_B_AyAeAqAkAqAcAyA_AuAcAoAoA_BuAwAgA{AaA}AsAyAcAmBgAiBcAuBiAaCiAqB}@mBaAcBm@oBy@{A}@cBu@wAo@kB{@}A}@cB_A_B??y@cB_A_Bm@oB??UiB??_@uBYsBCcCE}BD_CBwBByABs@M]YGw@LgACyD@cBGkDBgBCgBP}AAeC?wE@mDWqAFoAIkACmAD}@OaCM}@GeDGyD@{BC??gBGyE?{EQ_CAwBEoFFoFKaF[kEc@aCU}B]yBK}Aq@eFg@sE_@kCAqBQmA@{Dg@}FYyF]wB@{Ba@iBWcCAgBS_Ec@{Dg@_B]}Bk@gFa@oB]wDs@yBm@{Dy@iBg@iCe@_CiA_Bc@cBq@}Ac@_Bk@aCk@aBq@aEoAsBi@qBc@wBYeCEeERaBHmBPwBb@wC`@wAToI`A{Cf@_BZQDsAV}@JmAPgAV{@TyATcEt@{BZmBHwBFkBLiEImEMuBKyASeB_@qC_@yBUcCKmC]sB[iEW{BWqBWoBa@oBWaB]gBOmEm@sBWgHcC_Bu@mD{CwB}BgBqAaBy@iIoCgEy@mBc@oE_A_Ei@qDQwDQiBMoBBiBHoBj@aExB_BhAeB`AuAdAcBx@mB^kBRiBNmCRoE\\eCVgEXoBFqBHuBHqBB??qB?oBFoBCyBFoB@oBFwBEaB]??iBY??wB[??cC[yDy@iBYqEm@aCk@aB[gB[mBWcB]sEs@{BYiEPuBP_B\\qBd@mBVeBZsBZ{B\\uBN??kB\\oC^oEr@mBXmBRkB^uBVoB\\cCh@qBVoBJsB\\qBXmB\\iCV}B\\iC\\yLpAwJ`AoE^qCB{ETeCAaCB}E?uBEsBMqCBgG?uB@_BGwBAoBBiBPmB\\wCr@mA`@{Ar@qBp@cBh@oB|@qBt@gBn@oBn@eDDmB~@iBlA{Bh@cBv@uAbAaB|@{EvBkEtBsBn@sCx@}DxAuAn@mBh@sA`AcBv@{Ah@{An@oAj@mAT}Ad@aBh@qAl@eA~@eAx@eA|@gAbAgBpAw@xAeBhC{@`Ao@|@{AlC{@|@y@`A{AxA{@|@wArA??kDrA??oBTkBPgBPgEh@sBVsBBmBJsBAeB^oBFkBJyBHsBBqBD{BHiBDoBHmBAoCa@sEmByC_DqE}B_Bw@oCgByAs@eBe@eBm@oLsAsAC_AAW@XEVOHYDk@Nc@M}@IaBK{CIaBEcBCkAJkAI}AEwAGaCEcBO}C@gAHiAX}@n@y@x@i@jCk@xAU|A[~AU`A]fAq@f@Yj@Wz@a@~@e@|@Ux@c@v@Yn@e@|@c@f@c@Xk@Vu@jAiBl@c@`@S~@Gv@]r@MpAg@`Bw@`@iAl@_ANw@Gw@Kk@Mq@IcAT}@j@iAn@k@l@e@`Ak@lBoAtAc@`Ac@~Bo@hA]dAGbABdAAbAP\\TRTh@FbA?bAZpBZ|@Q|@ItASnAQvA[rAM|AOhBWdBSj@Ov@QfAY|@i@|AkA^aA`@w@v@sAj@yBf@o@b@eAf@_Ad@mAh@{@f@eATs@NKR]ZWT{@`@e@Xk@d@eA\\w@To@X}@j@y@t@iAz@w@|@qAz@_Ax@k@~@q@dAs@lA_AdA{@bAiA~@u@`A_A`Aw@n@e@x@a@dAQhA[dAa@fAs@v@}@??p@aAbAoA|@_@h@i@ZYb@An@]\\a@|@]z@[f@i@d@}Af@kDl@sAhAs@vAkA`AYfBeAjBaBp@s@`AcAdAgAhAgAd@w@TOQUPLx@w@l@g@dAw@v@}AnBs@lB_AjBgBr@s@j@y@n@}@~@yAjAyAlBqAfBiAfBe@nC_A~Bm@jBa@xA]r@k@b@kA`@gAh@mATg@n@eA|A}AjASvCaAhAs@vAg@~Aq@pAs@~@F`AOtA]~ASlA_@^aAMcABgBCkBF_CHcB^wBd@wB`@aCXcC^eCN}BHcCNwBPmBGiCNyB?uCPiBN_B`@qAZoATsBh@gB`@}BPcBZoAf@aB`@oBZ_C^uB`@{Cr@mFJgCPsB`@aCReC??t@kB??pAoBjAsAdAaBx@cBn@kBn@kBn@kBNwBAkDx@qFhAaCnAmBfA_CjAwBxAsBfAuBn@uBl@_Ch@gCp@_Cv@iC`AmCv@{Bz@}B|@sB~@yBx@wBr@yBp@{B|@sBr@_Cl@iBtA}@zA[dAUp@CbAUpASn@eAZkARuAf@}Ad@aBz@uAv@iBVmB`@_C\\gCZaCh@_Cf@wCl@aC`AmFn@wB~@mBp@iB~@yBt@iC|@mC??zAqE??r@qB|@mBt@sBz@uB`A}Bn@aC`@mA\\u@b@m@b@}Ap@iB^cB^uB`@kB^oANm@??DS??J_@Hi@H]H_@Bk@R_AJo@Jk@Vw@Js@Dm@KqAHiCGu@]eAMsAW{B[iAMiDFoA@}AE{CXoCb@uCRm@Ay@??B_A??Pu@Du@J}ADgBAyAPeBPyCLyAPmA@iACUFq@CiAPmADwAFsAMu@N}@\\gA^kADeA\\}@J{@DeAR_ADgAJ_BDgAJo@?m@Bi@s@IoAEcEw@eAOe@So@Ss@_@y@m@UUOULJY]g@g@{@w@i@cAk@u@o@gAu@qAi@oBS_BScBQcDOcBQiBQqBGkBMsBC{B]yBOqBW}B[}BYqBk@cBs@eBeAsAyA{AsAgAsCmCsAiAuAyA{AeAsAoAyA{A}AwA}A}AuAuAcBuAwAoAwAkAuAkAkAoAcByAcBsA}AsAyA{A??yAsAgByAqA{AcAaBkA{AgA}AqCgDgAeBkA{A??iA}A}@yAkAcBgA}AmAwA}@}AkAeBaBkAgAyAsAcBaA{AwAyBmA_BqAwAuAoBoCiDuBkDkAyAkAwA_A}AuAeBiAuAiA}AaAaBmA}AgA{A{AyAeAcBkAaBmAiBeAaBgAgBsA}AqAyA}@aBqAmAiAu@}AcA}AcA}AiAaBy@wAuAyAiAgB{A{AgAkAoAyA{AgBuA_BmAiAwAsAuAyAqAuAqA}AoAwAsAmAsAsAgA{@aAy@k@gAcA}@_A??eBkA??gAmAcAaAyAoAqAsAkAgAuA}AcBmAsAkAuAoAsAkAyAcAgAkA_AgA_@WSe@cAq@eA_AmAoAqAsAiB}AeByA}AwAyA_BqBsAgBqAmAmAcAaAeA{@??}@_AeA}@kAaAoAw@y@u@u@o@}@_AcAeAkA_AcAy@q@m@eAs@g@i@q@k@g@y@s@{@}AaAq@s@{A_B}@m@}@_AcA{@gAeAy@m@k@_AaAo@o@w@{@o@{A}A{@o@u@q@a@c@c@e@WA[[EU]]e@k@g@m@a@q@Wm@i@aAo@}@]g@?[[i@Oe@Se@SiAUw@Sw@Ki@C[[]g@VaAxA_@d@Sh@e@Vm@t@Yx@m@dAe@`@g@f@q@vA]h@i@VmAjCw@~@Qj@_@t@k@`@c@`@k@|@q@p@g@j@]v@u@l@m@j@aApAgA`BmArA_AfAk@d@g@Zq@`AwAxAcAbA_AfAg@fA[f@o@|@_@f@y@z@Wb@Ul@Yd@k@~@k@~@U\\K^_@t@c@^cAbB_@nAYf@YLa@f@c@t@qAdCs@bAeAzAeBjDm@fAy@jAiAjB}@tA}@nAc@tAs@r@a@n@g@r@{@lAeAtBuAxByAjCwApCsBrCuCxFuBzFwAhFs@nBq@~B_BzEy@bCaA~B{@fCu@~Bu@vBcA|By@|Bu@dCq@vBq@|Ai@tAi@tBcAlCqBpF}@fCeAfCaArCy@lC??w@lCiAjC{@jCaApCgAfC}@lCgAvDcAhC{B|Fs@`Cw@dCu@zB_AzBm@vBcAbBwAtAgBbBiBvAeB`BwAzAqAxB}A`B{A|A_AjAaBdBwA|A_D|DcB`B_BnBaBrAyAdBgB`B{AvBgBxBgC|CmClDiFtFoExE{C~D{BlCkBnBgBlBmElFmBjBgBtBiB`CeEvF_BzAwAz@iA`BoAzAgClD??sAlA??}AdC{CdEmA`C}@vBoAtAs@dBaArAeAdBeApBwAdCmCjEoAvBsA`CkAxB{AfCyAzBcBfDcB`C}AnCyAfC}CxF}AdCsApBaB`DcDhFmApBqCxE_BdCkAnBmA~BmAlBkAjBeAxBeAjBkAzAeAlB_AvBwAnBsA`BaBpDqCbEgApBgAlB}@pB{A`D[bAw@`Bo@lB{@|B{@hBgAtBuDdDwAzA{AvA_BbB{AfBsB~AgBdBaBlBmB~AaBpB{AfBaBzAuArAsAnAsArAyApAeB|AgB|BkB|AkBdBgBlBsAvB_BnBsA~BsAbCgAjCgBnCiAjCyCdFaBxCkAdCkAxB{A~B??oAfB??aBxCcBbDyAdDiAfDiCtCuAlAkAjBsA~C_ClEcAnBeC|DaAxBeAlBoAhBiAdC_BhBwBzBcAzAkAdCu@dBc@vAq@nAg@lBw@bByA`AaBjA_BtAuBfBsAbBkBz@kBv@wBt@??_CpA}B`AuBz@oBt@cCjAuCdA_C|@??cC|@??uE~BmBfBuArBiAfCcBpCoE|F}BxDmAhBkAlBoAfBuAbCoA~BsCtEuAhBiAlBiB`CiCzEcA~A}@h@??MsA??_@_B?uAQkCI{EKoB[yAwBmAcEw@wBm@gB]iBs@mBc@}BYwFcBiF}AgCq@kCk@aCw@qCa@iBg@??wBqB??yAmByAeB_DiDgBkByC}DwAiBkA}AoAeBsAgA_BYoBBu@KYEY@OOY@??a@UQ}@@{A@sATgBRkBFmA??HsA??TmBJeCNyA@w@_@HkAUaD_@kBCyDIsAGi@_A[kAA_AGyA]aB]qAEuAKqB_@eG?aCJ_Cv@sEHoB??b@mB??EcB??OwBM}B??DaC??EkA@s@k@Q}BFgAF??cAI??q@I{@CyADkBPmFn@_C`@kEb@cBBkBFoBFqD{@cCUoAa@[gA`AqDZkB`@{BPyBJkCLkCLkC^}CRmC^kCt@eGb@iC^kC^cCp@uBzAiA~@{ARoBHkBCsBHsBDiBtAcE??R{AGcA??YaA??Yi@Au@@s@VW^o@d@s@^sAw@iB??m@O??MUp@r@hA`Bi@dAe@bA??St@Er@EzALp@LxADpAw@`BYfACbBC|AKdB[dEAhBcAhAiAtAcAdCS|Ac@hB]tBKbBg@fD[~BKbCq@vBYhDI`CM`CIdF]rBg@vBu@lCY|AhAlAxDj@rBPrEFnBEnDq@dCSxEi@nDs@??|BC|AL`AN|@Hj@?tAQp@JFt@Ar@?dAFnALxBLvCi@bFc@fCWfCChCFjC@jCV`C`@lEXnD??R~A??CnA`@zAfAFvAH|A`@nBLrBC|AFbB^IvA@tAQnASvBIhBYzAG~A??GvBOzANtAn@j@jA@n@@j@Dr@FfAj@??bBt@bAlAfAvAvArAjAfBtAfBvA`B~AfBtArAvAtA|AfBjAvAjB~@~Bd@hDrBrBv@`Dh@zE~@fB\\nB\\hBl@dCVlB`@tBtBvBPpBV~D`AhAnAf@`CNfCPjCJxBJrBNxBA~@gAfBcA`BeAtAoAjBgAtB_BlAkAjBiFjKsAzByArBuAnBkApB{AhC}CrEgB~BgB`DmArB}CnF_B~BwA|B}A~BwA`CsAlBqAnBqAlCeCvEoA~CiBpDq@zA_AdBaA~A}@|AyAdBgA`AsAlAoAlAqAt@{@~@mBh@kBx@{AbAiCnAeCtCoA`BmArBoAhCmAfBgAlB{@`BcAnB}@nBoArBqArBkAzBkAzBiAnBuAjBgApBcAzBgAtBsApAgAlBcAjBS`AEVB]{jJb{OEPf@Dy@CXJt@C~@GdAKfAKnAGlBIpAcC]cDW_BK}AWmBUkAMiBA_BAaBAaBF}A\\mBj@aBv@sAl@c@f@e@v@m@lA_@|Dk@xBSnBUrBaAbCwAxBcBdCeB`C{A|ByApBaB`CeAdBkApAy@pAiApAcApBw@zCqBvAcAnAaAtAw@|Au@zAwAbB{@bAu@bAe@t@_@bBiAlBqAjBiAdBcA|As@bBwArCaB`DmBvCoBdD{B`D{BnDmCdBg@`F{@rCe@tCq@jCY~C_@`C_@~Bg@pC_@nCMpC[xDw@rFkAfCcArB]dCq@jCaAbBi@z@[`Ak@jAgAfA_Bv@cBr@aBj@yBpAmBdBmAlASlC?lCWzDFhADVDUKX?~@FbBRhBFrBLvB?pBGnE_AnBg@vBe@bCq@vB_A`B[tBy@vBu@rBaAjB}@nCcBxEyBhBaArBy@~BeAfCy@lBoA|AkAfBaA~A{AjBsA~B_B~B{@vB{@pBy@lEsBnBaAlBwArBmA`B}@rA_AtA_AhAm@|Au@jAs@pA[~CsA`Bi@hAe@zAWz@c@hA{@`A]lA_@x@u@hA]`Aq@fAu@lA}@dAi@~@s@t@_Av@mAp@uAl@eBh@oBhAuAn@kBl@w@?S{u@dm@';

            function replaceAll(search, replacement) {
                var target = this;
                return target.split(search).join(replacement);
            };
            //encodedString =replaceAll('\\', '\\\\');
            console.log(encodedString);
            var myLatlng = new google.maps.LatLng(22.717081666666665, 75.87155666666666);
            var myOptions = {
                zoom: 14,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            var map = new google.maps.Map(document.getElementById("drivers_map"), myOptions);
            var decodedPath = google.maps.geometry.encoding.decodePath(encodedString);
            //var decodedPath = google.maps.geometry.encoding.decodePath("}~kvHmzrr@ba\hnc@jiu@r{Zqx~@hjp@pwEhnc@zhu@zflAbxn@fhjBvqHroaAgcnAp}gAeahAtqGkngAinc@_h|@r{Zad\y|_D}_y@swg@ysg@}llBpoZqa{@xrw@~eBaaX}{uAero@uqGadY}nr@`dYs_NquNgbjAf{l@|yh@bfc@}nr@z}q@i|i@zgz@r{ZhjFr}gApob@ff}@laIsen@dgYhdPvbIren@");
            var decodedLevels = decodeLevels("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
            var setRegion = new google.maps.Polyline({
                path: decodedPath,
                levels: decodedLevels,
                strokeColor: "#333",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map
            });
        }

        function decodeLevels(encodedLevelsString) {
            var decodedLevels = [];

            for (var i = 0; i < encodedLevelsString.length; ++i) {
                var level = encodedLevelsString.charCodeAt(i) - 63;
                decodedLevels.push(level);
            }
            return decodedLevels;
        }

        initialize();


    }
})();

