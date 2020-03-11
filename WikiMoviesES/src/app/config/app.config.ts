// @dynamic

import {environment} from '../../environments/environment';

export class AppConfig {
  static get rootApi(): string {
    return environment.wiki_movies_api;
  }

  static searchApi(searchText: string, fromYear: number, toYear: number, from: number, pageSize: number): string {
    return `${AppConfig.rootApi}/api/ES/Search?searchText=${searchText}&fromYear=${fromYear}&toYear=${toYear}&from=${from}&pageSize=${pageSize}`;
  }

  static getDocWithIdApi(id: any) {
    return `${AppConfig.rootApi}/api/ES/Get?documentId=${id}`;
  }
}
