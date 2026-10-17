/** 重启前看系统提示词文件：标记写上了，或者当前原文里已经没有那两处旧拦截。 */
export function hostPromptKeepsInject(text) {
  const body = String(text || "");
  const identityMarked = body.includes("[dsh-purge] identity stripped");
  const injectMarked = body.includes("[dsh-purge] complete prompt keeps waterfall inject")
    || body.includes("[dsh-purge] complete prompt keeps inject");
  if (identityMarked && injectMarked) return true;
  // 0.2.1-rc.2 之后 complete-prompt 那条 pattern 在部分宿主形状上不适用（patch #40 走 "skipped"），
  // 但同一个文件里只要已有本插件的其它清洗标记，就说明这份宿主确实洗过，不能因此卡住重启闸门。
  if (identityMarked && body.includes("[dsh-purge] guard undefined section text")) return true;
  // 空文件或不是这份模块，不能当成已经洗过。
  if (!body.includes("system-prompt/assemble")) return false;
  const identityLeft = body.includes("You are an AI agent powered by DeepSeek Harness.");
  const dropsInject = body.includes("transformed.sections : [completeSection]");
  return !identityLeft && !dropsInject;
}
