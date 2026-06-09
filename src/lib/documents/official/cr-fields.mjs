// Exact AcroForm field names inside the official CR-180 / CR-181 PDFs (Rev. Jan 1, 2024).
//
// These are the hierarchical Adobe LiveCycle field names enumerated from the decrypted
// PDFs. They are versioned by the form revision and WILL change if the Judicial Council
// republishes the forms — when that happens, re-run the enumeration documented in
// ../templates/official/SOURCES.md and reconcile the names here.
//
// Only the subset of fields we deterministically fill is listed. Everything else on the
// forms (e.g. the multi-row conviction table rows 2-5, attorney bar number, fax) is left
// blank for the petitioner/staff to complete by hand.

export const CR180_FIELDS = {
  caseNumber: 'CR-180[0].Page1[0].P1Caption[0].HeaderSub[0].Stmp[0].CaseNumber[0].CaseNumber1[0]',
  // Attorney / party-without-attorney block.
  partyName: 'CR-180[0].Page1[0].P1Caption[0].AttyPartyInfo[0].Name[0]',
  partyFirm: 'CR-180[0].Page1[0].P1Caption[0].AttyPartyInfo[0].AttyFirm[0]',
  partyStreet: 'CR-180[0].Page1[0].P1Caption[0].AttyPartyInfo[0].Street[0]',
  partyCity: 'CR-180[0].Page1[0].P1Caption[0].AttyPartyInfo[0].City[0]',
  partyState: 'CR-180[0].Page1[0].P1Caption[0].AttyPartyInfo[0].State[0]',
  partyZip: 'CR-180[0].Page1[0].P1Caption[0].AttyPartyInfo[0].Zip[0]',
  partyPhone: 'CR-180[0].Page1[0].P1Caption[0].AttyPartyInfo[0].Phone[0]',
  partyEmail: 'CR-180[0].Page1[0].P1Caption[0].AttyPartyInfo[0].Email[0]',
  attyFor: 'CR-180[0].Page1[0].P1Caption[0].AttyPartyInfo[0].AttyFor[0]',
  // Court block.
  courtCounty: 'CR-180[0].Page1[0].P1Caption[0].CourtInfo[0].CrtCounty[0]',
  courtStreet: 'CR-180[0].Page1[0].P1Caption[0].CourtInfo[0].CrtStreet[0]',
  courtMailing: 'CR-180[0].Page1[0].P1Caption[0].CourtInfo[0].CrtMailingAdd[0]',
  courtCityZip: 'CR-180[0].Page1[0].P1Caption[0].CourtInfo[0].CrtCityZip[0]',
  // Defendant (repeated in the caption on pages 2 & 3 as well).
  defendant: 'CR-180[0].Page1[0].P1Caption[0].TitlePartyName[0].Defendant[0]',
  defendantP2: 'CR-180[0].Page2[0].pXCaption[0].Defendant[0]',
  defendantP3: 'CR-180[0].Page3[0].pXCaption[0].Defendant[0]',
  caseNumberP2: 'CR-180[0].Page2[0].pXCaption[0].CaseNumber1[0]',
  caseNumberP3: 'CR-180[0].Page3[0].pXCaption[0].CaseNumber1[0]',
  // Conviction date + first conviction-table row (we fill row 1 only; rows 2-5 are manual).
  convictionDate: 'CR-180[0].Page1[0].LI1[0].li1[0].ConvictionDate[0]',
  convRow1Code: 'CR-180[0].Page1[0].LI1[0].li1[0].ConvTable[0].Row1[0].Code1[0]',
  convRow1Section: 'CR-180[0].Page1[0].LI1[0].li1[0].ConvTable[0].Row1[0].Section1[0]',
  convRow1Type: 'CR-180[0].Page1[0].LI1[0].li1[0].ConvTable[0].Row1[0].TypeOff1[0]',
  // Relief checkboxes (item 2 = 1203.4, item 3 = 1203.4a, item 5 = 1203.41, item 6 = 1203.42, item 4 = 1203.49).
  basis1203_4: 'CR-180[0].Page1[0].LI2[0].ProbationGranted[0]',
  basis1203_4a: 'CR-180[0].Page2[0].LI3[0].OffenseWSentence[0]',
  basis1203_41: 'CR-180[0].Page2[0].LI5[0].CheckBox19[0]',
  basis1203_42: 'CR-180[0].Page3[0].LI6[0].li6[0].OffenseWSentence[0]',
  basis1203_49: 'CR-180[0].Page2[0].LI4[0].li4[0].OffenseWSentence[0]',
};

export const CR181_FIELDS = {
  caseNumber: 'CR-181[0].Page1[0].Caption[0].HeaderSub[0].CaseNumber[0].CaseNumber2[0]',
  partyName: 'CR-181[0].Page1[0].Caption[0].AttyPartyInfo[0].Name[0]',
  partyStreet: 'CR-181[0].Page1[0].Caption[0].AttyPartyInfo[0].Street[0]',
  partyCity: 'CR-181[0].Page1[0].Caption[0].AttyPartyInfo[0].City[0]',
  partyState: 'CR-181[0].Page1[0].Caption[0].AttyPartyInfo[0].State[0]',
  partyZip: 'CR-181[0].Page1[0].Caption[0].AttyPartyInfo[0].Zip[0]',
  partyEmail: 'CR-181[0].Page1[0].Caption[0].AttyPartyInfo[0].Email[0]',
  attyFor: 'CR-181[0].Page1[0].Caption[0].AttyPartyInfo[0].AttyFor[0]',
  courtCounty: 'CR-181[0].Page1[0].Caption[0].CourtInfo[0].CrtCounty[0]',
  courtStreet: 'CR-181[0].Page1[0].Caption[0].CourtInfo[0].CrtStreet[0]',
  courtCityZip: 'CR-181[0].Page1[0].Caption[0].CourtInfo[0].CrtCityZip[0]',
  defendant: 'CR-181[0].Page1[0].Caption[0].TitlePartyName[0].Party1[0]',
  caseNumberP2: 'CR-181[0].Page2[0].P2Header[0].CaseNumber2[0]',
  shortTitleP2: 'CR-181[0].Page2[0].P2Header[0].Party1[0]',
  // CR-181 is the ORDER (the judge's decision). We never pre-check grant/deny on the draft
  // order — that is the court's choice. We only fill the caption so it matches the petition.
};
