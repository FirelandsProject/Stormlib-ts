#include <napi.h>
#include <StormLib.h>

Napi::Value CreateArchive(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() < 3)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  std::string filename = info[0].As<Napi::String>().Utf8Value();
  DWORD flags = info[1].As<Napi::Number>().Uint32Value();
  DWORD maxFileCount = info[2].As<Napi::Number>().Uint32Value();

  HANDLE hMpq;
  if (SFileCreateArchive(filename.c_str(), flags, maxFileCount, &hMpq))
  {
    return Napi::Number::New(env, reinterpret_cast<uintptr_t>(hMpq));
  }
  else
  {
    Napi::Error::New(env, "Failed to create archive").ThrowAsJavaScriptException();
    return env.Null();
  }
}

Napi::Value OpenArchive(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() < 3)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  std::string filename = info[0].As<Napi::String>().Utf8Value();
  DWORD priority = info[1].As<Napi::Number>().Uint32Value();
  DWORD flags = info[2].As<Napi::Number>().Uint32Value();

  HANDLE hMpq;
  if (SFileOpenArchive(filename.c_str(), priority, flags, &hMpq))
  {
    return Napi::Number::New(env, reinterpret_cast<uintptr_t>(hMpq));
  }
  else
  {
    Napi::Error::New(env, "Failed to open archive").ThrowAsJavaScriptException();
    return env.Null();
  }
}

Napi::Value CloseArchive(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() < 1)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hMpq = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());

  if (SFileCloseArchive(hMpq))
  {
    return Napi::Boolean::New(env, true);
  }
  else
  {
    return Napi::Boolean::New(env, false);
  }
}

Napi::Value AddFile(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() < 4)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hMpq = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());
  std::string filename = info[1].As<Napi::String>().Utf8Value();
  std::string archivedName = info[2].As<Napi::String>().Utf8Value();
  DWORD flags = info[3].As<Napi::Number>().Uint32Value();

  if (SFileAddFileEx(hMpq, filename.c_str(), archivedName.c_str(), flags, MPQ_COMPRESSION_ZLIB, MPQ_COMPRESSION_NEXT_SAME))
  {
    return Napi::Boolean::New(env, true);
  }
  else
  {
    return Napi::Boolean::New(env, false);
  }
}

Napi::Value ExtractFile(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() < 3)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hMpq = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());
  std::string archivedName = info[1].As<Napi::String>().Utf8Value();
  std::string filename = info[2].As<Napi::String>().Utf8Value();

  if (SFileExtractFile(hMpq, archivedName.c_str(), filename.c_str(), SFILE_OPEN_FROM_MPQ))
  {
    return Napi::Boolean::New(env, true);
  }
  else
  {
    return Napi::Boolean::New(env, false);
  }
}

Napi::Value ListFiles(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() < 1)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hMpq = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());
  std::string searchText = info[1].As<Napi::String>().Utf8Value();
  SFILE_FIND_DATA findFileData;
  HANDLE hFind;
  Napi::Array fileList = Napi::Array::New(env);

  hFind = SFileFindFirstFile(hMpq, searchText.c_str(), &findFileData, NULL);
  if (hFind != NULL)
  {
    uint32_t index = 0;
    do
    {
      fileList.Set(index++, Napi::String::New(env, findFileData.cFileName));
    } while (SFileFindNextFile(hFind, &findFileData));

    SFileFindClose(hFind);
  }

  return fileList;
}

Napi::Value OpenFileEx(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() < 3)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hMpq = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());
  std::string filename = info[1].As<Napi::String>().Utf8Value();
  DWORD flags = info[2].As<Napi::Number>().Uint32Value();
  HANDLE hFile;

  if (SFileOpenFileEx(hMpq, filename.c_str(), flags, &hFile))
  {
    return Napi::Number::New(env, reinterpret_cast<uintptr_t>(hFile));
  }
  else
  {
    Napi::Error::New(env, "Failed to open file").ThrowAsJavaScriptException();
    return env.Null();
  }
}

Napi::Value ReadFile(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() < 2)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hFile = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());
  size_t size = info[1].As<Napi::Number>().Uint32Value();
  char buffer[size];
  DWORD readBytes = 0;

  if (!SFileReadFile(hFile, buffer, size, &readBytes, NULL))
  {
    Napi::Error::New(env, "Failed to read file").ThrowAsJavaScriptException();
    return env.Null();
  }
  std::string text = buffer;

  return Napi::String::New(env, text);
}

Napi::Value CloseFile(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() < 1)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hFile = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());

  if (SFileCloseFile(hFile))
  {
    return Napi::Boolean::New(env, true);
  }
  else
  {
    return Napi::Boolean::New(env, false);
  }
}

Napi::Value GetFileSize(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() < 1)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  HANDLE hFile = reinterpret_cast<HANDLE>(info[0].As<Napi::Number>().Int64Value());
  auto size = 0;

  size = SFileGetFileSize(hFile, NULL);

  if (size != 0)
  {
    return Napi::Number::New(env, size);
  }
  else
  {
    Napi::Error::New(env, "Failed to get file size").ThrowAsJavaScriptException();
    return env.Null();
  }
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(Napi::String::New(env, "createArchive"), Napi::Function::New(env, CreateArchive));
  exports.Set(Napi::String::New(env, "openArchive"), Napi::Function::New(env, OpenArchive));
  exports.Set(Napi::String::New(env, "closeArchive"), Napi::Function::New(env, CloseArchive));
  exports.Set(Napi::String::New(env, "addFile"), Napi::Function::New(env, AddFile));
  exports.Set(Napi::String::New(env, "extractFile"), Napi::Function::New(env, ExtractFile));
  exports.Set(Napi::String::New(env, "listFiles"), Napi::Function::New(env, ListFiles));
  exports.Set(Napi::String::New(env, "openFileEx"), Napi::Function::New(env, OpenFileEx));
  exports.Set(Napi::String::New(env, "readFile"), Napi::Function::New(env, ReadFile));
  exports.Set(Napi::String::New(env, "closeFile"), Napi::Function::New(env, CloseFile));
  exports.Set(Napi::String::New(env, "getFileSize"), Napi::Function::New(env, GetFileSize));

  return exports;
}

NODE_API_MODULE(stormlib, Init)