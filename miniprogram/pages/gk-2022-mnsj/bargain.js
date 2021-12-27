const BASE_URL = 'https://zg99.offcn.com/index';  // 调取的网络路径
const actid = '41590';                            // zg99 表单id
const title = "助力-2022国考模拟试卷";              // 标题
const spid = 2;                                   // 商品id（商品表中所属商品的id）
const CRMEFSID = "6718b04c16c0961ef5148761b514a3ac";       // CRM 活动表单 ID
const CRMEventID = "HD202109011712";                // CRM 注释 小程序-国考模拟卷测评助力,活动表单ID:98241

const getSesionkeyAPI = `${BASE_URL}/wechat/getsesionkey?actid=${actid}&callback=`; // 获取 sesionkey
const getUserPhoneAPI = `${BASE_URL}/wechat/getphone?actid=${actid}&callback=`; // 手机号解密(这里不需要)
const registAPI = `${BASE_URL}/kanjia/register?actid=${actid}&callback=`; // 注册
const getsplistAPI = `${BASE_URL}/kanjia/getsplist?actid=${actid}&callback=`; //获取课程列表(这里不需要)
const writeyqAPI = `${BASE_URL}/kanjia/writeyq?actid=${actid}&callback=`; //写入邀请列表
const getyqlistAPI = `${BASE_URL}/kanjia/getyqlist?actid=${actid}&callback=`; //获取邀请列表
const writexzAPI = `${BASE_URL}/kanjia/writexz?actid=${actid}&callback=`; //写入协助列表
const getxzlistAPI = `${BASE_URL}/kanjia/getxzlist?actid=${actid}&callback=`; //获取协助列表
const getspinfoAPI = `${BASE_URL}/kanjia/getspinfo?actid=${actid}&callback=`; //获取课程信息

module.exports = {
  title,spid,CRMEFSID,CRMEventID,
  getSesionkeyAPI,
  getUserPhoneAPI,
  registAPI,
  getsplistAPI,
  writeyqAPI,
  getyqlistAPI,
  writexzAPI,
  getxzlistAPI,
  getspinfoAPI
};