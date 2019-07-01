import { KeyValue, PsbtGlobal, PsbtInput, PsbtOutput } from './interfaces';
import { GlobalTypes } from './typeFields';

export function checkForInput(
  inputs: PsbtInput[],
  inputIndex: number,
): PsbtInput {
  const input = inputs[inputIndex];
  if (input === undefined) throw new Error(`No input #${inputIndex}`);
  return input;
}

export function checkForOutput(
  outputs: PsbtOutput[],
  outputIndex: number,
): PsbtOutput {
  const output = outputs[outputIndex];
  if (output === undefined) throw new Error(`No output #${outputIndex}`);
  return output;
}

export function checkHasKey(
  checkKeyVal: KeyValue,
  keyVals: KeyValue[],
  enumLength: number,
): void {
  if (checkKeyVal.key[0] < enumLength) {
    throw new Error(
      `Use the method for your specific key instead of addKeyVal*`,
    );
  }
  if (keyVals.filter(kv => kv.key.equals(checkKeyVal.key)).length !== 0) {
    throw new Error(`Duplicate Key: ${checkKeyVal.key.toString('hex')}`);
  }
}

export function getEnumLength(myenum: any): number {
  let count = 0;
  Object.keys(myenum).forEach(val => {
    if (Number(isNaN(Number(val)))) {
      count++;
    }
  });
  return count;
}

export function inputIsUncleanFinalized(input: PsbtInput): boolean {
  const isP2SH = !!input.redeemScript;
  const isP2WSH = !!input.witnessScript;
  const isNonSegwit = !!input.nonWitnessUtxo;
  const isSegwit = !!input.witnessUtxo;
  if (isSegwit === isNonSegwit) return false;
  const needScriptSig = isNonSegwit || (isSegwit && isP2SH);
  const needWitnessScript = isSegwit && isP2WSH;
  const scriptSigOK = !needScriptSig || !!input.finalScriptSig;
  const witnessScriptOK = !needWitnessScript || !!input.finalScriptWitness;
  return scriptSigOK && witnessScriptOK;
}

export function insertTxInGlobalMap(
  txBuf: Buffer,
  globalMap: PsbtGlobal,
): void {
  const txKeyVals = globalMap.keyVals.filter(
    kv => kv.key[0] === GlobalTypes.UNSIGNED_TX,
  );
  const len = txKeyVals.length;
  const tx = globalMap.unsignedTx;
  const hasTx = tx !== undefined ? 1 : 0;
  if (len + hasTx !== 1) {
    throw new Error(
      `Extract Transaction: Expected one Transaction, got ${len + hasTx}`,
    );
  }
  if (tx !== undefined) globalMap.unsignedTx = txBuf;
  else txKeyVals[0].value = txBuf;
}