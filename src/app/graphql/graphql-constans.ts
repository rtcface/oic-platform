import { gql } from "apollo-angular";

export const GET_ENTES_PUBLICOS = gql`
  query RegresaEntes {
    entes: getEnte {
      id
      nombre_ente
    }
  }
`;

export const GET_STADISTICS = gql`
  query getHistory($ente: HistoryRuleByEnteInput!) {
    staditics: getHistoryIntegrityRulesByEnte(input: $ente) {
      p1
      p2
      p3
      p4
      p5
      p6
      p7
      p8
      p9
      p10
      p11
      p12
      p13
      p14
      p15
      p16
    }
  }
`;