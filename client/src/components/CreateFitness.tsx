import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { createFitness, uploadFile } from '../api/fitness-api'

enum UploadState {
  NoUpload,
  UploadingData
}

interface CreateFitnessProps {
  match: {
    params: {}
  }
  auth: Auth
}

interface CreateFitnessState {
  name: string
  description: string
  uploadState: UploadState
}

export class CreateFitness extends React.PureComponent<
  CreateFitnessProps,
  CreateFitnessState
> {
  state: CreateFitnessState = {
    name: '',
    description: '',
    uploadState: UploadState.NoUpload
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      this.setUploadState(UploadState.UploadingData)
      await createFitness(
        this.props.auth.getIdToken(),
        this.state.name,
        this.state.description
      )

      alert('Fitness was created!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Create new Fitness</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input
              placeholder="Fitness's name"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              placeholder="Fitness's description"
              value={this.state.description}
              onChange={this.handleDescriptionChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.UploadingData && (
          <p>Uploading Fitness metadata</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Create
        </Button>
      </div>
    )
  }
}
