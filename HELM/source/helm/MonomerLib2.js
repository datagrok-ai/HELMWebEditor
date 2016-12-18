﻿//////////////////////////////////////////////////////////////////////////////////
//
// Pistoia HELM
// Copyright (C) 2016 Pistoia (www.pistoiaalliance.org)
// Created by Scilligence, built on JSDraw.Lite
//
//////////////////////////////////////////////////////////////////////////////////


var lib =
;

function readMonomer(x) {
    var m = { id: x.alternateId, n: x.name, na: x.naturalanalog, type: x.polymerType, mt: x.monomertype, m: x.molfile };

    m.at = {};
    var rs = 0;
    for (var r = 1; r <= 5; ++r) {
        if (x["R" + r]) {
            m.at["R" + r] = x["R" + r];
            ++rs;
        }
        else if (x["r" + r]) {
            m.at["R" + r] = x["r" + r];
            ++rs;
        }
    }
    m.rs = rs;
    return m;
}
org.helm.webeditor.Monomers.loadDB(lib, readMonomer);