import React from 'react';
import './App.css';
import JsonData from './doc.json';
import Highlight from 'react-highlight.js';

const makeHref = sentence => sentence !==  undefined && sentence.replace('/\W/g', '-');

// type, property, name, class, see, description, export, extends, 

// const SplitByNoteArray = [];
// JsonData.map(type => type.kind ? SplitByNoteArray.push([type]) :  SplitByNoteArray[SplitByNoteArray.length - 1].push(type))
// console.log('/////', SplitByNoteArray);

const chooseChildType = ({ type, url, children, value }) => {
  switch(type) {
    case 'link':
      return <a href={url}>{children[0].value}</a>
    case 'inlineCode':
      return <code>{value}</code>
    default:
      return value;
  }
}

const chooseParamType = (param) => {
  switch(param.type.type) {
    case 'NameExpression':
      return <code><a href={`#${param.type.name}`}>{param.type.name}</a></code>;
    case 'UnionType':
      return param.type.elements.map(
        (element, i) => 
          param.type.elements === i ? 
            <code><a href={`#${element.name}`}>{element.name}</a></code>
            : <code><a href={`#${element.name}`}>{element.name}</a> | </code> 
      );
    default:
      return param.name;
  }
}

const createProperGithubLink = ({ context: { github: { url } } }) =>
  url.split('/').map((u, i) => i === 6 ? 'documentation-migration' : u).join('/');


function App() {
  return (
    <div className="layout">
      <aside>
        <div class="overflow">
          <h1>Abstract SDK</h1>
            {
              JsonData.map(type => {
                if (type.kind && type.kind === 'note') {
                return (<span>{type.name}</span>)
                }
              return (<a href={`#${makeHref(type.name)}`}>{type.name}</a>)
              })
            }
        </div>
      </aside>

      <main>
          {/* {
            JsonData.map(documentedCode => console.log(documentedCode.name, documentedCode.kind))
          } */}
          {
            JsonData.map(documentedCode => documentedCode.kind === 'class' && (
                <section className="Document">
                  <h3 id={makeHref(documentedCode.name)} className="Document__Title">
                  {documentedCode.name}
                    {/* <a href={makeHref(documentedCode.name)}></a> */}
                  </h3>
                  {
                    documentedCode.context !== undefined && (
                      <p>GitHub: <a href={createProperGithubLink(documentedCode)}>{documentedCode.context.github.path}</a></p>
                    )
                  }
                  <code className="Document__CodeExample">
                    {
                      documentedCode.name.includes('Client') ?
                        `new Client()` : `new Client().${documentedCode.name.toLowerCase()}()`
                    }
                  </code>
                  <p className="Document__Description">
                    {
                      documentedCode.description.children !== undefined && documentedCode.description.children.length > 0 && documentedCode.description.children.map(desc =>
                        desc.type === 'html' ? <span>{desc.value}</span> : desc.children.map(child => chooseChildType(child))
                      )
                    }
                  </p>
                  <div className="Document__Members">
                    {
                      documentedCode.members.static.length > 0 && documentedCode.members.static.map(instances => (
                        <div className="Document__Instances">
                          <h4>{instances.name}</h4>
                          <p>GitHub: <a href={createProperGithubLink(instances)}>{instances.context.github.path}</a></p>
                          <p>Member of <em>{instances.memberof}</em></p>
                          <code>
                            new Client().{instances.memberof.toLowerCase()}().{instances.name}(
                                  {instances.params.map((param, i) => i === instances.params.length - 1 ? param.name : `${param.name}, `)}
                                )
                          </code>
                          <h5>Params:</h5>
                          <ul>
                          {
                            instances.params.map((param, i) => (
                              <li>
                                <span>{param.name}</span> : {chooseParamType(param)}
                              </li>
                            ))
                          }
                          </ul>
                          {
                            instances.examples.map(example => (
                              <Highlight language="javascript">
                                {example.description}
                              </Highlight>
                            ))
                          }
                        </div>
                      ))
                    }
                  </div>
                  <div>
                  {
                    documentedCode.sees.length > 0 && (
                      <div>
                        <h5>See</h5>
                        <ul>
                          {
                            documentedCode.sees.map((see) =>
                              <li>
                                <a href={`#${makeHref(see.description.children[0].children[0].children[0].value)}`}>{see.description.children[0].children[0].children[0].value}</a>
                              </li>
                            )
                          }
                        </ul>
                      </div>
                    )
                  }
                  </div>
                  <br /><br />
                </section>
              ) || documentedCode.kind == undefined && (
                <section className="Document">
                  <h3 id={makeHref(documentedCode.name)} className="Document__Title">
                    {documentedCode.name}
                    {/* <a href={makeHref(documentedCode.name)}></a> */}
                  </h3>
                  {/* {
                    console.log(documentedCode)
                  } */}
                  {
                    documentedCode.description && (
                      documentedCode.description.children.map(desc =>
                        desc.type === 'html' ? <p dangerouslySetInnerHTML={{ __html: desc.value}} /> : (
                          <p className="Document__Description">{desc.children.map(child => chooseChildType(child))}</p>
                        )
                      )
                    )
                  }
                  <div class="Document__Members">
                    {
                      documentedCode.properties.length > 0 && <h5>Params:</h5>
                    }
                    <ul>
                      {
                        documentedCode.properties.length > 0 && documentedCode.properties.map((prop, i) => (
                          <li>
                            <span>{prop.name}</span> : {chooseParamType(prop.type)}
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </section>
              )
            )
          }
      </main>
    </div>
  );
}

export default App;
