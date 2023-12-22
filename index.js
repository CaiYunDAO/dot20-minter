import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";

(async function () {
  const wsProvider = new WsProvider("wss://rpc.polkadot.io");
  const api = await ApiPromise.create({ provider: wsProvider });
  // 导入账户
  const keyring = new Keyring({ type: "sr25519" });
  // 这里填自己的助记词
  const my = keyring.addFromUri("助记词");

  // 286275
  async function mint(token) {
    const tx1 = api.tx.balances.transferKeepAlive(my.address, 0);
    const tx2 = api.tx.system.remark(
      `{"p":"dot-20","op":"mint","tick":"${token}"}`
    );

    return await api.tx.utility.batchAll([tx1, tx2]).signAndSend(my);
  }

  // 这里填需要铸造的数量
  const num = 1;
  // 这里填需要铸造的token名称
  const token = "DOTA";
  // 这里填锻造成功之后等待的时间，单位为秒
  const wait = 6;

  console.log(`开始铸造 ${token}，铸造数量为 ${num}`);
  console.log("====================================");
  for (let i = 0; i < num; ) {
    try {
      console.log(`开始铸造第${i + 1}个`);
      const mintHash = await mint("DOTA");
      console.log(`铸造上链成功，hash: ${mintHash}`);
      i++;
    } catch (e) {
      console.log(`铸造失败，等待${wait}秒`);
    } finally {
      if (i === num) {
        console.log("====================================");
        console.log(`铸造完成，共铸造${num}个`);
        return;
      }
      await sleep(wait * 1000);
    }
  }
})();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
