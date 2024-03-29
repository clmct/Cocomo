import React, { useState, useMemo } from "react";
import { ratingFactor, costDrivers, calculateIntermediateCocomo, ResultColumn } from "cocomo";
import styled from "styled-components";
import { RadioGroup } from "components";
import useMediaQuery from "react-use-media-query-hook";
import { Typography } from 'antd';

const InitialValue: ratingFactor = {
  reliability: 3,
  sizeOfDatabase: 3,
  Complexity: 3,

  performanceConstraints: 3,
  memoryConstraints: 3,
  environmentVolatility: 3,
  turnaboutTime: 3,

  analystCapability: 3,
  applicationsExperience: 3,
  programmerCapability: 3,
  virtualMachineExperience: 3,
  languageExperience: 3,

  applicationMethods: 3,
  softwareTools: 3,
  requiredSchedule: 3,
};

const driversKeys = [
  { key: "reliability", text: "Требуемая надежность ПО" },
  { key: "sizeOfDatabase", text: "Размер БД приложения" },
  { key: "Complexity", text: "Сложность продукта" },
  { key: "performanceConstraints", text: "Требования к быстродействию" },
  { key: "memoryConstraints", text: "Ограничения памяти" },
  { key: "environmentVolatility", text: "Неустойчивость окружения" },
  { key: "turnaboutTime", text: "Время восстановления" },
  { key: "analystCapability", text: "Аналитические способности" },
  { key: "applicationsExperience", text: "Способности к разработке ПО" },
  { key: "programmerCapability", text: "Опыт разработки" },
  {
    key: "virtualMachineExperience",
    text: "Опыт использования виртуальных машин",
  },
  { key: "languageExperience", text: "Опыт языка" },
  { key: "applicationMethods", text: "Инструменты разработки" },
  { key: "softwareTools", text: "Методы разработки" },
  { key: "requiredSchedule", text: "График разработки" },
];

interface IntermediateCocomoProps {
  team: "organic" | "semidetach" | "embedded";
  KLoC: number;
}
export const IntermediateCocomo: React.FC<IntermediateCocomoProps> = ({
  team,
  KLoC,
}) => {
  const [drivers, setDrivers] = useState(InitialValue);
  const isMobile = useMediaQuery("(max-width: 400px)");

  const handleUpdate = (driver: string, newValue: number) =>
    setDrivers({ ...drivers, [driver]: newValue });

  const res = useMemo(() => calculateIntermediateCocomo(team, KLoC, drivers), [
    drivers,
    team,
    KLoC,
  ]);

  return (
    <>
    <Grid1>
      <ResultColumn title={Round(res.PM)} label="Трудоемкость(PM), чел.× мес" />
      <ResultColumn title={Round(res.TM)} label="Время разработки(TM), мес" />
    </Grid1>

      <hr />

      <Columns>
        {isMobile ? (
          <>
            <div>Оч. низ.</div>
            <div>Низ.</div>
            <div>Сред.</div>
            <div>Выс.</div>
            <div>Оч. выс.</div>
            <div>Крит.</div>
          </>
        ) : (
          <>
            <div>Очень низкий</div>
            <div>Низкий</div>
            <div>Средний</div>
            <div>Высокий</div>
            <div>Очень высокий</div>
            <div>Критический</div>
          </>
        )}
      </Columns>



        {driversKeys.map(({ key, text }) => (
            <>
              {(() => {
                if (key === "reliability") {
                  return (
                        <Name>Характеристики продукта</Name>
                  )
                } else if (key === "performanceConstraints") {
                  return (
                        <Name>Характеристики аппаратного обеспечения</Name>
                  )
                } else if (key === "analystCapability") {
                  return (
                        <Name>Характеристики персонала</Name>
                  )
                } else if (key === "applicationMethods") {
                  return (
                        <Name>Характеристики проекта</Name>
                  )

                }
              })()}

              <Grid>
              <RadioGroup
                  title={text}
                  selectRadio={handleUpdate}
                  value={drivers[key]}
                  radioValues={costDrivers[key]}
                  group={key}
                  key={key}
              />
              </Grid>

            </>
        ))}

    </>
  );
};

export const Name = styled.h6`
text-align: center;
`;

export const Grid1 = styled.div`
  display: grid;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    & > :not(:last-child) {
      border-right: 1px solid var(--input-placeholder, #ced6e0);
    }
  }

  @media (max-width: 599px) {
    margin: -20px 0;
    & > :not(:last-child) {
      border-bottom: 1px solid var(--input-placeholder, #ced6e0);
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-gap: 8px;
  @media (min-width: 920px) {
    grid-template-columns: 120px 1fr;
  }
`;

const Res = styled.header`
  text-align: center;
  margin: 2em;
  & h3 {
    margin-bottom: 0.5em;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 28px;
    line-height: 1.35;
  }
  & .label {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
`;

const Columns = styled.div`
  background-color: white;
  border-bottom: 1px solid #e8e8e8;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  text-align: center;
  overflow: hidden;
  position: sticky;
  top: 0;
  padding: 1em 0;
  z-index: 1;

  @media (min-width: 920px) {
    padding-left: 120px;
  }

  & div {
    align-items: center;
    display: flex;
    justify-content: center;
    height: 32px;
  }
`;
const Round = (value: number) => (value == 0 ? 0 : Number(value).toFixed(2));
