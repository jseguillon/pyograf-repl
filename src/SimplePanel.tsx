import React, { useEffect, useState } from 'react'; //useReducer, useState 
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, IconButton } from '@grafana/ui'; //useTheme
import { Helmet } from 'react-helmet';
import { RefreshEvent } from '@grafana/runtime';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ eventBus, id, options, data, width, height }) => {
  // const theme = useTheme();
  const [viewReplInit, setviewReplInit] = useState<boolean>(true);
  const [viewReplRefresh, setviewReplRefresh] = useState<boolean>(true);

  const styles = getStyles();

  console.log(id);

  useEffect(() => {

    // FIXME: id per pannel 
    (window as any).X=data
    //FIXME: really need timeout ? 
    setTimeout(() => {
      try {
        //FIXME: run per pannel id and only refresh
        (document as any).getElementById("btnRun").click()
        console.log(`TODO: better message`)
      }
      catch(e){
        console.log("Could not run + TODO give id", e)
      }
    },)

    const subscriber = eventBus.getStream(RefreshEvent).subscribe(event => {
      console.log(`Received event: ${event}`);
    })

    return () => {
      subscriber.unsubscribe();
    }
  }, [eventBus, data]);
  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {/* FIXME: move to const getStyles */}
      <style jsx>{`
      #btnRun {
        display: none
      }
      #output {
        display: inline;
        overflow: scroll;
      }
      #code-editor {
        overflow: scroll;
        min-height: 100px;
        min-width: 100%;
        width: 100%;
      }
      py-repl{
        overflow: scroll;
        height: 30%;
        display: flex;
        width: 100%;
      }
      .parentBox {
        width: 100%
      }
      .pyograf_output {
        font-family: "Courier New", monospace;
        white-space: pre;
        height: 100%;
        width: 100%;
        overflow: scroll;
      }
      div[error] {
        background-color: red !important;
      }
    `}</style>
      {/* <Helmet><script id="pyo-boot" src="https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js"></script></Helmet> */}
      <Helmet><link rel="stylesheet" href="https://pyscript.net/alpha/pyscript.css"/></Helmet>
      <Helmet><script defer src="https://pyscript.net/alpha/pyscript.js"></script></Helmet>
      <Helmet>
        {/* FIXME not working (use document to inject or fork Helmet) */}
        {/* @ts-ignore */}
        <py-env >{`
          - numpy
          - matplotlib
        `}
        {/* @ts-ignore */}
        </py-env>
      </Helmet>
      {/* FIXME: set pyscript ids according to pannel id*/}
      {/* but ensure they share same root id and namespace (when implemented) */}
      {/* FIXMEs: ensure height is aligned with given from grafana ui */}
      {/* FIXMEs: ensure any pyscript option is available as grafana option */}
      {/* FIXMEs: ensure theme is aligned with grafana config */}
      <span>
        <IconButton name="eye" onClick={() => setviewReplInit(!viewReplInit)} hidden={!viewReplInit}/>
        <IconButton name="eye-slash" onClick={() => setviewReplInit(!viewReplInit)} hidden={viewReplInit}/>
        Init&nbsp;
        {/* @ts-ignore */}{/* @jsx-ignore */}
        {<py-repl output-mode="replace" style={viewReplInit ? {} : { display: 'none' }}  theme="dark" output="my_output" data={data.request.requestId}></py-repl>}
      </span>

      <span>
        <IconButton name="eye" onClick={() => setviewReplRefresh(!viewReplRefresh)} hidden={!viewReplRefresh}/>
        <IconButton name="eye-slash" onClick={() => setviewReplRefresh(!viewReplRefresh)} hidden={viewReplRefresh}/>
        Refresh&nbsp;
        {/* @ts-ignore */}{/* @jsx-ignore */}
        {<py-repl output-mode="replace" style={viewReplRefresh ? {} : { display: 'none' }}  theme="dark" output="my_output" data={data.request.requestId}></py-repl>}
      </span>
      {/* @ts-ignore */}
      <div>{data.request.requestId}</div>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
