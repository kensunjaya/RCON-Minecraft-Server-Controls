export interface Player {
  name_clean: string;
  uuid: string;
  xp: number | undefined;
}

export interface Players {
  list: Player[];
  online: boolean;
  max: number;
}

export interface ServerData {
  host: string;
  port: number;
  icon: string | null;
  version: Version;
  ip_address: string;
  motd: Motd;
  mods: string[];
}

interface Version {
  name_raw: string;
  name_clean: string;
  name_html: string;
}

interface Motd {
  raw: string;
  clean: string;
  html: string;
}