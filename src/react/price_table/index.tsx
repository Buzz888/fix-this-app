import React, { Fragment, useMemo, useState } from "react";
import Papa from "papaparse";
import { Empty, Table, Upload } from "@arco-design/web-react";
import { ColumnProps } from "@arco-design/web-react/es/Table";

const usePriceTable = () => {
  const [csv, setCsv] = useState<string[][]>();

  const handleUpload = (file: File) => {
    Papa.parse<string[]>(file, {
      complete: function (results) {
        const res = results.data;
        if (res.length > 0) {
          setCsv(res);
        }
      },
    });
    return true;
  };

  const { columns, data } = useMemo(() => {
    const data: { [x: string]: string | number }[] = [];
    const columns: ColumnProps<{ [x: string]: string | number }>[] = [];

    if (csv && csv.length > 1) {
      const columnsArray = csv[0];
      const dataArray = csv.slice(1);

      dataArray.map((value: string[], dataIndex) => {
        columnsArray.forEach((key: string, index: number) => {
          if (dataIndex === 0) {
            columns.push({ title: key, dataIndex: key });
          }
          data[dataIndex] = {
            key: dataIndex,
            ...(data[dataIndex] || {}),
            [key]: value[index],
          };
        });
      });
    }

    return { data, columns };
  }, [csv]);

  return { handleUpload, data, columns };
};

const PriceTable = () => {
  const { handleUpload, data, columns } = usePriceTable();

  return (
    <Fragment>
      <div>
        <div className="price_upload">
          <Upload showUploadList={false} beforeUpload={handleUpload} />
        </div>
        <div className="price_table">
          {columns && columns.length > 0 ? (
            <Table data={data} columns={columns} />
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export { PriceTable };
export default PriceTable;
