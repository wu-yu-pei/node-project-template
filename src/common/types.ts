export enum NewsType {
  XINWEN = '新闻资讯',
  TONGZHI = '通知公告',
  RENSHI = '人事变动',
  QUWEN = '趣闻乐事',
}

export interface News {
  id: number;
  type: string;
  content: string;
  title: string;
  state: number;
  createAt: number;
  view: number;
  coins: number;
}

export interface Image {
  id: number;
  news_id?: number;
  url: string;
}
